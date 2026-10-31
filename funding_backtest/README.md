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
| `strategies.py` | Passive, Threshold, Rotation: they only output target weights |
| `engine.py` | hourly simulation: fills, fees, slippage, funding, liquidations, events |
| `report.py` | metrics, tables, PNG chart, dashboard data |
| `run.py` | command line + grid search |

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

## Results snapshot (defaults, 2021-01 to 2026-09)

| Strategy | CAGR | Max DD | Sharpe | Funding | Fees+slip | Liq. | Deployed |
|---|---|---|---|---|---|---|---|
| Passive BTC | 6.1% | -1.2% | 4.6 | $45.6k | $5.0k | 0 | 100% |
| Threshold BTC (X=15%, Y=5%) | 6.0% | -1.2% | 4.7 | $29.4k | $4.0k | 0 | 25% |
| Rotation (top 5, every 24h) | -31.2% | -89.9% | -11.4 | $48.7k | $134k | 3 | 100% |
| Passive BTC, no rebalance | 6.7% | -1.7% | 4.3 | $43.1k | $0.7k | 2 | 100% |
| Savings 2.5% | 2.5% | 0% | – | – | – | – | – |

What it says:

- **BTC basis trades beat savings, mostly thanks to 2021** (+19%). Since 2022 they make about
  2-6%/yr, close to the savings rate.
- **Threshold BTC earns about the same as Passive while deployed only 25% of the time.** Most
  BTC funding comes in a few hot periods.
- **The naive rotation loses money in every period, from fees.** Swapping the top-N coins
  every day costs far more than the extra funding brings in. No grid setting
  for N, K or L is profitable after 2023. A hold buffer (keep a coin while it stays in the top 2N)
  or a minimum expected gain before switching would be the obvious next experiment.
- **Grid search:** the best in-sample setting (Threshold, L=3, X=15%, Y=0%) made 9.7%/yr in
  2021-23 and 4.5%/yr out of sample (2024+). Expect the out-of-sample number, not the in-sample one.

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
