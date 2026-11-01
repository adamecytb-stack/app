# Funding-rate backtest (long spot + short perp)

Backtest of delta-neutral funding-rate strategies on Binance USDT-M perps, 2021-01-01 to the
last full month in Binance's public archive (currently 2026-09-30). Backtest only: no keys, no
live trading.

## Quick start

```bash
cd funding_backtest
pip install -r requirements.txt
python run.py            # compare the strategies with the defaults in config.py
python run.py --grid     # also run the grid search (~3 min)
python run.py --refresh  # rebuild the panel (picks up newly published months)
python optimize.py --mode basket     # re-tune the always-invested basket (~7 min on 4 cores)
python optimize.py --mode rotation   # re-tune the rotation (~4 min on 4 cores)
```

The first run downloads about 25k small files from `data.binance.vision` (5-10 min) and caches
them as parquet in `cache/`. Later runs take seconds.

Outputs:

| File | What |
|---|---|
| `output/summary.md` | metrics, return per period, 10 worst events, year-by-year breakdown, 12-month return percentiles |
| `output/equity.png` | equity curves vs 2.5% savings, plus drawdowns |
| `output/summary.csv`, `periods.csv`, `worst_events.csv` | the same as CSV |
| `output/yearly_breakdown.csv` | per strategy and year: start/end balance, profit $ and %, funding, costs, liquidations, max DD |
| `output/rolling_12m.csv` | per strategy: 5th/25th/50th/75th/95th percentile of 12-month returns |
| `output/grid_results.csv` | every grid run: full period, in-sample (2021-23), out-of-sample (2024+) |
| `output/optimize_results.csv` | every rotation setting the optimizer tried |
| `output/optimize_basket.csv` | every basket setting the optimizer tried |
| `../docs/index.html` + `data.js` | interactive dashboard (GitHub Pages) |

### Dashboard (GitHub Pages)

Open `docs/index.html` locally, or publish it: GitHub repo **Settings → Pages → Build and
deployment → Deploy from a branch**, then pick your branch and the `/docs` folder. It's a
static page with no build step. `run.py` rewrites `docs/data.js` on every run.

## Modules

| File | Job |
|---|---|
| `config.py` | every setting: fees, slippage, leverage, X/Y/N/K, grid values |
| `data.py` | download + cache, point-in-time universe, hourly panel |
| `strategies.py` | Passive, Threshold, Rotation, Basket: they only output target weights |
| `engine.py` | hourly simulation: fills, fees, slippage, funding, liquidations, events |
| `report.py` | metrics, tables, PNG chart, dashboard data |
| `run.py` | command line + grid search |
| `optimize.py` | strategy tuning (basket grid / rotation random search) on 2021-23, checked on 2024+ |

## How the simulation works

**Data.** Binance's public archive (`data.binance.vision`): 1h spot and perp klines, plus funding
history with the real settlement times. 1h/4h/8h coins are handled because each settlement is
annualized with its own interval: `rate × 8760 / interval_hours`. The REST API (and so ccxt) is
geo-blocked in some regions; the archive isn't, and it keeps delisted coins.

**Universe.** For each month, the top 30 perps by the *previous* month's volume (plus BTC and ETH),
limited to perps that also have a Binance spot pair. `1000PEPEUSDT`-style contracts are mapped to
their spot pair with the multiplier. Spot and perp prices are cross-checked, and coins whose
prices don't match are skipped.

**No lookahead.** Decisions use data up to the close of hour *t* and fill at the open of *t+1*.
Funding paid at the start of a bar only goes to positions held before that bar's trades.

**Sizing.** Capital C at short leverage L splits into spot `C·L/(1+L)` and margin `C/(1+L)`;
the short has the same quantity as the spot. At 1.5x that is 60% spot and 40% margin.

**Costs.** Taker fees of 0.10% spot and 0.05% perp per side. Slippage per fill is
`2 bps + 100 bps × sqrt(order / trailing 24h volume of that leg)`, capped at 5%.

**Liquidation.** Isolated margin; `p_liq = (margin + q·entry) / (q·(1 + mmr))`, mmr = 0.5%.
It's checked against every hourly perp **high**. If hit, the margin is gone, the spot leg is sold at
the next candle's close, and the event is logged. Funding is credited to the margin, so
collected funding pushes the liquidation price further away.

**Rebalancing (default on).** When the perp price moves more than 20% from the last (re)balance,
both legs are resized back to the target leverage (fees paid). A top-up only trims the short and
sells a slice of spot; it doesn't close and re-open the whole short, which would cost twice the
fees. Set `RiskConfig.rebalance_drift = None` to turn it off.

**Loss controls (optional, used by the optimized basket).**
- `liq_guard` + `liq_action`: act once the price has covered e.g. 85% of the way from the last
  (re)balance to the liquidation price, either by topping up (`"topup"`) or closing the coin (`"swap"`).
- `reserve_frac` + `auto_add_margin`: keep e.g. 5% of equity as cash (earning savings). If a
  candle would hit a short's liquidation price, margin moves over from the reserve first, like
  Binance's "auto-add margin". It's free, with no trade. The next close re-balances the position
  and refills the reserve.
- `vol_k`: volatility-scaled leverage per coin (calm coins get more, jumpy coins less).

**Optional stop.** `RiskConfig.stop_move = 0.30` closes both legs after a 30% move from entry.
It's off by default.

**Idle cash** earns 2.5%/yr. Sharpe is computed from daily returns in excess of that rate.

## Results snapshot (2021-01 to 2026-09)

| Strategy | CAGR | Max DD | Funding | Fees+slip | Liq. | Final ($100k start) |
|---|---|---|---|---|---|---|
| **Basket (optimized)** | **8.4%** | **-2.4%** | $69.6k | $15.6k | **0** | $158.7k |
| Rotation (optimized) | 9.2% | -6.5% | $64.1k | $14.2k | 13 | $165.9k |
| Basket (no reserve) | 8.0% | -3.9% | $63.0k | $12.3k | 6 | $155.6k |
| Passive BTC | 6.6% | -1.2% | $46.2k | $1.3k | 0 | $144.8k |
| Threshold BTC (X=15%, Y=5%) | 6.1% | -1.2% | $29.5k | $2.9k | 0 | $140.8k |
| Rotation top 5, every 24h (naive) | -30.7% | -89.7% | $49.5k | $135.7k | 3 | $12.1k |
| Savings 2.5% | 2.5% | 0% | – | – | – | $115.3k |

Return per year:

| | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 (to Sep) |
|---|---|---|---|---|---|---|
| Basket (optimized) | +29.2% | +1.2% | +6.5% | +10.7% | +1.2% | +1.6% |
| Rotation (optimized) | +31.0% | +2.5% | +6.4% | +8.6% | +5.0% | +1.9% |
| Basket (no reserve) | +30.6% | +0.8% | +3.1% | +10.0% | +2.9% | +1.3% |
| Passive BTC | +20.3% | +2.3% | +4.9% | +7.4% | +3.1% | +1.3% |
| Threshold BTC | +19.6% | +2.5% | +3.4% | +6.4% | +2.5% | +1.9% |
| Savings | +2.5% | +2.5% | +2.5% | +2.5% | +2.5% | +1.9% |

The honest comparison is **2024+** (data no strategy was tuned on):

| Strategy | 2021-23 (tuning period) | 2024+ (unseen) |
|---|---|---|
| Rotation (optimized) | +12.6%/yr | **+5.6%/yr**, max DD -3.8%, 13 liquidations over the whole run |
| Basket (optimized) | +11.7%/yr | **+4.8%/yr**, max DD -0.5%, 0 liquidations |
| Threshold BTC, best grid setting | +10.0%/yr | +4.6%/yr |
| Passive BTC, best grid setting | +8.9%/yr | +4.3%/yr |

### Year by year: Basket (optimized)

| Year | Start | End | Profit | Profit % | Funding | Fees + slip | Liq. | Max DD |
|---|---|---|---|---|---|---|---|---|
| 2021 | $100,000 | $129,218 | +$29,218 | +29.2% | $34,862 | $3,830 | 0 | -2.4% |
| 2022 | $129,218 | $130,756 | +$1,538 | +1.2% | $2,649 | $3,237 | 0 | -0.3% |
| 2023 | $130,756 | $139,317 | +$8,562 | +6.5% | $9,372 | $1,592 | 0 | -1.1% |
| 2024 | $139,317 | $154,195 | +$14,878 | +10.7% | $15,884 | $1,635 | 0 | -0.4% |
| 2025 | $154,195 | $156,116 | +$1,921 | +1.2% | $3,797 | $3,462 | 0 | -0.5% |
| 2026 (to Sep) | $156,116 | $158,663 | +$2,547 | +1.6% | $3,046 | $1,799 | 0 | -0.2% |

Every strategy and year is in `output/yearly_breakdown.csv` and in the dashboard's "Year by year" card.

### How good or bad can a year get? (12-month return percentiles)

Return over every 12-month window (one per start day, 1,734 windows). p5 = only 5% of 12-month
periods were worse; median = a typical year; p95 = only 5% were better.

| Strategy | Worst | p5 | p25 | Median | p75 | p95 | Best | 12m windows below savings |
|---|---|---|---|---|---|---|---|---|
| Basket (optimized) | +1.1% | +1.4% | +2.5% | +4.1% | +9.9% | +12.1% | +29.2% | 25% |
| Rotation (optimized) | +2.3% | +2.4% | +2.5% | +5.2% | +8.3% | +16.5% | +32.5% | 29% |
| Passive BTC | +1.9% | +2.1% | +3.0% | +4.3% | +7.0% | +10.0% | +20.4% | 14% |
| Threshold BTC | +2.3% | +2.5% | +2.5% | +3.4% | +5.9% | +9.3% | +19.7% | 16% |
| Savings | +2.5% | +2.5% | +2.5% | +2.5% | +2.5% | +2.5% | +2.5% | – |

No 12-month window lost money for any of these. But a typical year makes about 4-5%, and a
quarter of all 12-month windows did worse than plain savings.

## Always-invested basket (no rotation)

`Basket` keeps the money invested in the basis trade, equal weight across N coins picked each
January and held all year. Coins are not rotated on funding. A coin only leaves when:

- **it gets close to liquidation** and the rule is `liq_action="swap"` (with `"topup"`, the default
  chosen, it is kept and its margin is topped up instead),
- **it was liquidated anyway**, or **its market data ends** (delisting).

The free slot goes to the biggest coin in the current month's top 30 that isn't held or banned.
A coin forced out can't come back for 30 days. Optionally (`pause_apr`) a coin's slice waits in
2.5% savings while its 7-day funding is below 0%, and goes back in above 5%.

**Chosen** (`OPTIMIZED_BASKET` in `config.py`): the 5 best-paying coins (90-day funding) among the
15 biggest, 5x short leverage, a **5% cash reserve with auto-add margin**, top up at 85% of the way
to liquidation, pause on negative funding. Picked by `python optimize.py --mode basket` (512
settings) as the highest 2021-23 CAGR **with zero liquidations in 2021-23**.

What the grid says:

- **The cash reserve is what removes the losses.** Share of settings with zero liquidations over the
  whole run: 9% with no reserve, 79% with 5%, 96% with 10%, 100% with 20%. And it barely costs
  return: median 2024+ CAGR 4.3% (no reserve) vs 4.5% (5%).
- **Almost everything beats savings:** 97% of settings did out-of-sample.
- **...but the settings barely matter going forward.** Nearly all land at 3-5%/yr on 2024+.
- **Picking coins by funding didn't really help out-of-sample** (median 4.0% vs 4.7% for picking by
  volume). It happened to top the in-sample ranking. The same setup picked by volume made +4.8%
  on 2024+, the same.
- **Volatility-scaled leverage didn't help** (median 4.0% vs 4.6%).
- **Act late, not early:** a guard at 85% beat 50% (fewer costly top-ups). **Top-up ≈ swap.**

## Making the rotation profitable

The naive rotation (hold the top 5 by 24h funding, re-pick every day) changes positions about
900 times a year. Each round trip costs more than the funding it collects in its ~2 days, so fees
eat everything. The fix is to trade less, using four optional settings in `RotationParams`:

| Setting | What it does | Chosen value |
|---|---|---|
| `lookback_hours` | average funding over a longer window, so the ranking stops flickering | 336 (14 days) |
| `min_apr` / `exit_apr` | hysteresis: enter above X, only exit below Y | enter > 20%, exit < 5% |
| `hold_rank` | keep a held coin while it stays in the top M (not just the top N) | top 10 (N = 5) |
| `min_volume` | only enter coins with enough daily volume on both legs | $100M |

Plus N = 5 coins, checked every 8h, 3x short leverage (`OPTIMIZED_ROTATION` in `config.py`).
`python optimize.py --mode rotation` tried 330 settings and picked the best 2021-23 CAGR: +12.6%
in-sample, **+5.6%/yr on 2024+**. 92% of settings beat savings in-sample, 61% out-of-sample.

Risk note: at 3x it had 13 liquidations (fast alt pumps). The same settings at **2x** made +10.9%
in-sample and +5.5% out-of-sample with only 3 liquidations. That is the calmer choice: set
`OPTIMIZED_ROTATION_LEVERAGE = 2.0`.

## Can it make 15%+ a year?

Not as a delta-neutral funding trade on Binance in today's market. The ceiling is set by how
much funding the market pays. This is the sum of all funding paid per year (the return on a 1x
short, **before any fees**):

| Year | BTC | ETH | 5 biggest coins |
|---|---|---|---|
| 2021 | 30.6% | 37.5% | 37.9% |
| 2022 | 4.2% | 0.8% | -5.2% |
| 2023 | 7.9% | 8.3% | -2.7% |
| 2024 | 12.0% | 13.0% | 13.4% |
| 2025 | 5.1% | 4.9% | 3.6% |
| 2026 (to Sep) | 2.2% | 1.4% | 0.5% |

At 5x short leverage about 83% of the capital is in the trade, so even with zero fees the most a
majors basket could make is roughly 0.83 × these numbers. That is about 4% in 2025 and well under
2% in 2026. 15%+ only happened in hot bull markets (2021, almost 2024). To aim higher you'd have
to change what the strategy is, for example:

- **Borrow to scale the whole trade** (more than 100% of capital in it): only pays when funding is
  above the borrow rate, which it mostly wasn't after 2021.
- **Add directional exposure** (hold some spot unhedged): then returns depend on the crypto price,
  and losses can be large.
- **Stack yield on the legs:** staking yield on the spot leg (e.g. ETH), interest on the margin.
  That's maybe +2-4%/yr (this is how Ethena works), but it's not in this data.
- **Other venues** where funding runs higher (smaller exchanges, on-chain perps): more exchange
  and counterparty risk, and not in this data.
- **Cheaper execution** (maker orders, VIP fees): the optimized basket paid $15.6k in fees+slippage
  against $69.6k funding. Halving that adds about +1%/yr.

## Known limitations

- **Survivorship bias.** Reduced but not gone. Delisted coins are included through the archive,
  but only Binance is modeled (it survived; FTX didn't), and perps without a spot pair are excluded.
- **Not modeled:** exchange and counterparty risk, withdrawal/transfer delays, borrow limits,
  funding-rate caps changing over time, Binance's tiered maintenance margin, and the
  liquidation-clearance fee beyond losing the remaining margin.
- **Liquidations use the last-price high, not the mark price.** This is conservative: it can
  trigger on wicks that Binance's mark price would ignore.
- **Funding archive ends at the last full month.** The newest weeks are not included until
  Binance publishes the monthly file.
