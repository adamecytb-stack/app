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
| `output/summary.md` | metrics table, return per period, 10 worst events |
| `output/equity.png` | equity curves vs 2.5% savings, plus drawdowns |
| `output/summary.csv`, `periods.csv`, `worst_events.csv` | the same as CSV |
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
both legs are resized back to the target leverage (fees paid). Set
`RiskConfig.rebalance_drift = None` to turn it off. "Passive BTC (no rebalance)" shows that case.

**Optional stop.** `RiskConfig.stop_move = 0.30` closes both legs after a 30% move from entry.
It's off by default.

**Idle cash** earns 2.5%/yr. Sharpe is computed from daily returns in excess of that rate.

## Results snapshot (2021-01 to 2026-09)

| Strategy | CAGR | Max DD | Funding | Fees+slip | Liq. | Avg exposure |
|---|---|---|---|---|---|---|
| **Basket (optimized)** | **8.3%** | -2.1% | $63.2k | $13.5k | 4 | 74% |
| Rotation (optimized) | 8.1% | -6.9% | $62.9k | $21.7k | 13 | 23% |
| Passive BTC, no rebalance | 6.7% | -1.7% | $43.1k | $0.7k | 2 | 100% |
| Passive BTC | 6.1% | -1.2% | $45.6k | $5.0k | 0 | 100% |
| Threshold BTC (X=15%, Y=5%) | 6.0% | -1.2% | $29.4k | $4.0k | 0 | 25% |
| Rotation top 5, every 24h (naive) | -31.7% | -90.4% | $48.6k | $135k | 3 | 96% |
| Savings 2.5% | 2.5% | 0% | – | – | – | – |

Return per year:

| | 2021 | 2022 | 2023 | 2024 | 2025 | 2026 (to Sep) |
|---|---|---|---|---|---|---|
| Basket (optimized) | +29.8% | +0.7% | +6.0% | +9.6% | +2.8% | +1.2% |
| Rotation (optimized) | +26.8% | +2.5% | +6.0% | +6.8% | +4.3% | +1.9% |
| Passive BTC | +19.2% | +1.8% | +4.5% | +6.4% | +3.0% | +1.1% |
| Threshold BTC | +18.8% | +2.4% | +3.4% | +6.2% | +2.5% | +1.9% |
| Savings | +2.5% | +2.5% | +2.5% | +2.5% | +2.5% | +1.9% |

The honest comparison is the **2024+ column** (data no strategy was tuned on):

| Strategy | 2021-23 (tuning period) | 2024+ (unseen) |
|---|---|---|
| Basket (optimized) | +11.5%/yr | **+4.9%/yr**, max DD -0.3% |
| Rotation (optimized) | +11.2%/yr | +4.7%/yr, max DD -3.8% |
| Threshold BTC, best grid setting | +9.7%/yr | +4.5%/yr |
| Passive BTC | +8.2%/yr | +3.8%/yr |

## Always-invested basket (no rotation)

`Basket` keeps the whole $100k invested in the basis trade, equal weight across the **N biggest
coins by volume**. They are picked each January from December's volume and held all year. Coins
are not rotated on funding. A coin only leaves when:

- **it gets close to liquidation** and the rule is `liq_action="swap"`. "Close" is measured from
  the last (re)balance price: act once the price has covered `liq_guard` of the way to the
  liquidation price (0.85 = 85%). With `liq_action="topup"` the coin is kept instead: some spot is
  sold and the short's margin is topped back up to the target leverage.
- **it was liquidated anyway** (a candle jumped past the guard), or **its market data ends**
  (delisting).

The free slot goes to the biggest coin in the current month's top-30 that isn't held or banned. A
coin forced out can't come back for 30 days. Optionally (`pause_apr`) a coin's slice waits in
2.5% savings while its 7-day funding is below 0%, and goes back in above 5%.

`python optimize.py --mode basket` tests every combination (648) of N = 1/2/3/5/8/10, leverage
1-5x, guard at 50/70/85%, top-up vs swap, and three pause rules. It picks on 2021-23 only.

**Chosen:** top 3 coins, 3x, top up at 85% of the way to liquidation, pause on negative funding
(`OPTIMIZED_BASKET` in `config.py`).

What the grid says (median out-of-sample CAGR across all settings):

- **Almost everything works:** 95% of all 648 settings beat savings out-of-sample (vs 46% for
  rotation). Not rotating is much more robust.
- **...but the settings barely matter going forward.** In-sample results range from +1% to
  +11.5%/yr, yet nearly all land in the same 3-5%/yr band out-of-sample. Expect about 4-5%/yr from
  2024-style markets, whatever you pick.
- **More leverage stops paying above 2-3x.** Median out-of-sample CAGR by leverage: 1x 3.5%,
  1.5x 3.8%, 2x 4.1%, 3x 3.9%, 4x 3.9%, 5x 3.5%. Median liquidations climb from 0 (≤1.5x) to 12 (5x).
- **Act late, not early:** a guard at 85% beats 50%, because early action means many costly top-ups.
- **Top-up vs swap:** about the same (4.0% vs 3.6% median). Top-up trades less.
- **Pausing on negative funding helps a little** (4.0% vs 3.7% median).
- **Fewer coins did slightly better** (top 1-2: ~4.4%; top 8-10: ~3.3%). Bigger coins have
  steadier funding and cheaper trading.

## Making the rotation profitable

The naive rotation (hold the top 5 by 24h funding, re-pick every day) changes positions about
900 times a year. Each round trip costs more than the funding it collects in its ~2 days, so fees
eat everything. The fix is to trade less, using four optional settings in `RotationParams`:

| Setting | What it does | Chosen value |
|---|---|---|
| `lookback_hours` | average funding over a longer window, so the ranking stops flickering | 336 (14 days) |
| `min_apr` / `exit_apr` | hysteresis: enter above X, only exit below Y | enter > 20%, exit < 5% |
| `hold_rank` | keep a held coin while it stays in the top M (not just the top N) | top 10 (N = 5) |
| `min_volume` | only enter coins with enough daily volume on both legs (less slippage, fewer squeezes) | $100M |

Plus N = 5 coins, checked every 8h, 3x short leverage (`OPTIMIZED_ROTATION` in `config.py`).

**How it was chosen (and why to be skeptical):** `optimize.py` tried 330 settings and picked the
one with the best **2021-2023** CAGR among those with drawdown under 15%. Data from 2024 on was
never used to choose. Results:

| | 2021-23 (tuned on) | 2024+ (unseen) |
|---|---|---|
| Rotation (optimized) CAGR | +11.2% | **+4.7%** |
| Max drawdown | -6.9% | -3.8% |
| Share of all 330 settings beating savings | 91% | 46% |

So the strategy now makes money, but out of sample it earns about half its in-sample return,
roughly the same as the much simpler Threshold BTC (+4.5%/yr on 2024+). Take the
out-of-sample number as the realistic one.

Risk note: at 3x leverage it had 13 liquidations, mostly fast pumps in alts (XRP/XLM in Jan 2021,
GIGGLE in Nov 2025). Each cost 1-2.5% of equity because positions are capped at 20%. The same
settings at **2x** made 9.6% in-sample and 4.6% out-of-sample with only 3 liquidations. That is
the more comfortable choice if you'd rather give up a little return; set
`OPTIMIZED_ROTATION_LEVERAGE = 2.0`.

Other takeaways:

- **2021 was the outlier.** Every strategy made 19-30% in 2021 and 1-10%/yr since.
- **Threshold BTC earns about the same as Passive while deployed only 25% of the time.**
- **Fees, not funding, decide these strategies.** The naive and optimized rotations collect similar
  funding ($49k vs $63k). The difference is costs ($135k vs $22k).

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
