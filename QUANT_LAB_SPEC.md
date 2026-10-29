# QUANT LAB — Spec for Claude Code

Goal: find out, honestly and with statistics, whether any trading rule has a **real, repeatable edge after costs** on crypto, then paper-trade the survivors forward on MEXC.
This is a research pipeline that is designed to **kill bad ideas cheaply**, not a bot that promises profit.

Owner: Adam. Python, VS Code. Intermediate coder: keep code readable, comment the non-obvious parts, no clever one-liners.

---

## 0. FIRST: Ask before coding

Read this entire file first. Then ask me these questions in one message and wait for answers. Use the defaults for anything I skip.

1. **Paper venue:** MEXC spot, MEXC USDT-M perps, or both? *(Default: spot for directional strategies; perps only for the funding-carry strategy.)*
2. **Direction:** long/flat only, or long/short? *(Default: long/flat on spot. Shorts only via perps.)*
3. **Assets:** *(Default: BTC, ETH, SOL plus the 7 most liquid USDT pairs on MEXC that have existed since at least 2021.)*
4. **Timeframes:** *(Default: 1h, 4h, 1d. Nothing below 1h, because fees eat sub-hour strategies alive.)*
5. **Paper account:** size and risk per trade? *(Default: $10,000, 0.5% risk per trade.)*
6. **Historical data:** OK to use Binance public bulk data (data.binance.vision) for long history? MEXC's API history is short. *(Default: yes. Binance for research history, MEXC for paper execution prices.)*
7. **OS / scheduler** for the paper runner: Windows Task Scheduler, cron, or launchd?
8. **Telegram:** pipe paper-trade alerts into my existing Telegram bot? *(Default: no, log to files only.)*

Then create `CLAUDE.md` in the project root containing Section 1 (Standing rules) word for word, so it applies in every future session.

---

## 1. Standing rules (copy into CLAUDE.md)

These are non-negotiable. If a rule blocks progress, stop and tell me. Do not work around it.

1. **No real money.** Never use API keys with trade permission. Never place real orders. Paper trading uses public market data only.
2. **The holdout is sealed.** The final holdout period (Section 4) is never loaded, plotted, or summarized until a strategy has passed every gate on earlier data. Each strategy gets exactly **one** holdout run. Record it in the trial log. No re-running after tweaks.
3. **Every backtest is logged.** Every single run, including failed and buggy ones, is appended to `results/trials.csv`. Never delete or edit past rows. The total trial count feeds the overfitting statistics (Section 7). Hiding trials is the main way people fool themselves.
4. **Costs are never loosened to make something pass.** Fees and slippage only get *stricter* over time.
5. **No look-ahead.** A signal computed from bar *t* can only be acted on at the open of bar *t+1*. Any rolling statistic (percentiles, z-scores, normalizations, volatility regimes) uses only past data. Never compute a statistic over the full sample.
6. **The LLM is not the signal.** Claude may write code, generate hypotheses, review and critique, but it must **never** decide historical trades. Models have memorized price history up to their training cutoff, so any LLM-in-the-loop backtest on past data is contaminated by hindsight. An LLM-driven strategy can only be evaluated by **forward paper trading from today**.
7. **Report out-of-sample (OOS) only.** In-sample numbers may appear only labeled "IN-SAMPLE (not evidence)".
8. **Expectancy, not win rate.** Never rank or select strategies by win rate. A 90% win rate is trivial to produce with a tiny target and a huge stop, and it loses money.
9. **Too good = bug.** Any OOS result with Sharpe > 3, profit factor > 3, or a smooth equity curve on hourly crypto data is treated as a bug until proven otherwise. Run the leakage checks in Section 6.4 before celebrating.
10. **Failures are results.** Write every killed hypothesis into `RESEARCH_LOG.md` with one paragraph on why it failed.

---

## 2. Core concepts (why the pipeline looks like this)

### 2.1 Win rate above 50% does not mean profit

What matters is **expectancy per trade, after costs**:

```
E = p * avg_win - (1 - p) * avg_loss - costs_per_trade
```

Example: 55% win rate, average win 0.8R, average loss 1R gives `0.55*0.8 - 0.45*1.0 = -0.01R`. That loses money *before* fees.
Trend-following systems often win only 35–45% of trades and still profit, because the winners are large.
**The pipeline optimizes OOS expectancy and risk-adjusted return, never win rate.**

### 2.2 "Large amount of tests" cuts both ways

- **Many trades per strategy = good.** To tell a 55% hit rate from 50% with 95% confidence you need about 400 trades. To tell 52% from 50%, about 2,400 trades. Small samples prove nothing.
- **Many strategy variants = dangerous.** Test 1,000 random strategies and about 50 will look "significant" at p < 0.05 by pure luck. That is why every trial is counted, and why the Deflated Sharpe Ratio penalizes the number of variants tried.

### 2.3 Backtest ≠ paper trade

- **Backtests** run on history: fast, thousands of runs possible. This is where hypotheses get killed.
- **Paper trading** runs forward in real time, slowly. It is the final check that the backtest wasn't lying (fills, latency, regime change). Only a handful of survivors ever reach it.

### 2.4 Where retail edge plausibly exists in crypto

Ranked by prior plausibility (most to least):
1. **Trend / time-series momentum** on 4h–1d bars, documented in academic work on crypto.
2. **Funding-rate carry:** delta-neutral long spot + short perp, collecting positive funding. A structural premium, not a prediction.
3. **Cross-sectional momentum:** hold the recent strongest coins. Real, but survivorship bias is a trap.
4. **Volatility-regime filters** as an overlay that improves other strategies.
5. **Short-term mean reversion** on 1h. Often real before costs and dead after costs. Included as a test of the cost model.
6. **Time-of-day / day-of-week seasonality** (the viral "BTC time windows with >65% edge" claim). Lowest prior. Included explicitly as a debunk-or-confirm experiment.

---

## 3. Project structure

```
quant-lab/
  CLAUDE.md                 # standing rules (Section 1)
  config.yaml               # assets, timeframes, costs, splits, risk
  RESEARCH_LOG.md           # human-readable diary of what was tried and why it died
  HYPOTHESES.md             # pre-registered hypotheses (Section 5)
  data/raw/                 # cached downloads (parquet), never edited by hand
  src/
    data.py                 # download, cache, validate, split
    costs.py                # fees, slippage, funding
    engine.py               # backtester (event loop, numpy where safe)
    strategies/
      base.py               # Strategy interface
      trend.py  carry.py  xsmom.py  meanrev.py  seasonality.py  breakout.py
    filters.py              # volatility regime filter, vol targeting
    metrics.py              # all metrics in Section 6.1
    stats.py                # bootstrap CI, permutation test, DSR, BH-FDR, SPRT
    walkforward.py          # rolling train/test
    robustness.py           # the gauntlet (Section 6.3)
    trials.py               # append-only trial logger
    report.py               # markdown + PNG reports
    paper/
      broker.py             # PaperBroker: simulated fills on live MEXC prices
      runner.py             # scheduled signal -> paper order loop
      monitor.py            # live vs backtest comparison, SPRT, kill switch
  tests/
  results/
    trials.csv
    reports/
```

Libraries: `pandas`, `numpy`, `scipy`, `pyarrow`, `ccxt`, `matplotlib`, `pyyaml`, `pytest`. Avoid heavy frameworks so every number is traceable. Optionally use `vectorbt` **only** as a cross-check in Section 6.4.

---

## 4. Data layer (`data.py`)

**Sources**
- Research history: Binance public bulk klines (data.binance.vision), USDT spot pairs, 1h base bars. Resample to 4h and 1d **from 1h** in code.
- Funding history (for carry): Binance USDT-M funding history from the same source. Also pull MEXC funding history via `ccxt.fetch_funding_rate_history` where available, to check that MEXC funding behaves similarly.
- Paper execution: MEXC via ccxt, public endpoints only (ticker, order book, OHLCV).
- Before paper trading, sanity-check that MEXC and Binance 1h closes for BTC/ETH agree within a few bps.

**Conventions**
- All timestamps UTC. A bar's timestamp is its **open** time.
- Resampling: `label="left", closed="left"`. Drop partial bars at the edges.
- Validate on load: no duplicate timestamps, gaps listed and reported (not silently filled), OHLC consistency (low ≤ open/close ≤ high), no zero or negative prices.

**Point-in-time universe (for multi-asset strategies)**
On each date, a coin is only eligible if it already had ≥ 90 days of history and enough volume at that time. Include coins that were later delisted where data exists. Using today's top-10 list across all history is survivorship bias.

**Splits** (write these into `config.yaml` and hash them):

| Split | Period | Use |
|---|---|---|
| Development | data start (≈2019/2020) → 2024-06-30 | design, walk-forward |
| Validation | 2024-07-01 → 2025-09-30 | gate before holdout |
| **Holdout (sealed)** | 2025-10-01 → latest | one run per finalist |

The holdout must include the most recent market conditions. If the data starts later for an asset, keep the same date boundaries.

---

## 5. Hypotheses (pre-register in `HYPOTHESES.md` before running)

For each hypothesis write, **before testing**: the mechanism (*why* it should work), the exact rules, the parameter grid (small, ≤ 30 combinations), and the kill criteria. Then test.

### H1 — Trend following (time-series momentum)
- Long when the N-bar return > 0, or close > N-bar moving average. Flat otherwise.
- Bars: 4h and 1d. N ∈ {20, 50, 100, 200} (in bars).
- Sizing: volatility targeting (`position = target_vol / realized_vol_past`, capped at 1.0 for spot).
- Exit: signal flips. Variant with an ATR trailing stop.

### H2 — Funding carry (delta-neutral)
- When the trailing average funding is above a threshold that covers the **4 legs of fees** (spot buy + perp short on entry, both reversed on exit) over the expected holding time: long spot + short perp, equal notional, 1x on the perp side.
- Exit when funding falls below an exit threshold (hysteresis to avoid churning).
- P&L = funding received − fees on all legs − slippage − basis change between spot and perp.
- Check the funding interval per symbol from live data; do not assume 8h.
- Risk to model: funding flipping negative, basis blowouts, perp margin stress in a spike.

### H3 — Cross-sectional momentum
- Weekly: rank the eligible universe by past 4–12 week return (skip the most recent week), hold the top k (k ∈ {2, 3, 5}) equally weighted, long only.
- Must use the point-in-time universe.

### H4 — Volatility breakout
- Donchian: long on a close above the N-bar high, exit on a close below the M-bar low. N ∈ {20, 55}, M ∈ {10, 20}. Bars 4h and 1d.

### H5 — Short-term mean reversion (cost-model test)
- 1h bars. Long when a z-score of the short return (or RSI(2)) is extreme, **only** while price is above a long trend MA. Exit after a fixed number of bars or on reversion.
- Expected to fail after fees. If it passes, triple-check costs.

### H6 — Seasonality / "BTC time windows" (debunk-or-confirm)
- For each of the 168 hour-of-week buckets, measure on Development data the probability that BTC's next 1h (and 4h) return is positive.
- Pick the buckets that look best (e.g., > 55% up, or the top 10).
- Test those exact buckets on Validation. Apply the Benjamini–Hochberg false discovery rate correction across all 168 buckets.
- Expected result: the "best" windows regress toward 50%. Report it either way.

### Overlay F1 — Volatility regime filter
- Skip new entries when realized volatility is above its **rolling past** 80th percentile (expanding window, no future data).
- Test as an add-on to H1, H4, H5. Keep it only if it improves OOS on most assets.

### Overlay F2 — Position sizing
- Default for all research: **fixed-fractional risk** (0.5% of equity per trade, or vol targeting).
- Kelly only at the very end, for finalists, and then only **fractional Kelly (≤ 0.25×)** computed from the **lower bound** of the 95% confidence interval of the edge, never the point estimate. Full Kelly on an overestimated edge is how accounts blow up.

---

## 6. Backtest engine, metrics, and validation

### 6.1 Engine rules (`engine.py`)
- Signal on bar *t* close → order at bar *t+1* open, plus slippage.
- Stops and targets are checked intrabar using high/low. If one bar touches both stop and target, **count the stop** (conservative). If the bar opens past the stop (a gap), fill at the open, not at the stop.
- Fees on every fill's notional, from `config.yaml`. Default stress values: spot taker 0.10% per side, perp taker 0.05% per side. **Look up MEXC's current published fees and put the real numbers in config as `fees_real`; always also test at 2× and 3×.**
- Slippage default: 2 bps BTC/ETH, 5 bps other majors, 10 bps smaller alts, per fill. Stress at 2×.
- Perp positions pay or receive funding at each funding timestamp.
- Mark-to-market equity every bar. Track exposure, turnover and fees paid.

### 6.2 Metrics (`metrics.py`), reported per strategy, per asset, per split
Trades, win rate, average win/loss in R and %, **expectancy (R and %) after costs**, profit factor, CAGR, annualized volatility, Sharpe, Sortino, max drawdown and its duration, exposure %, turnover, fees as % of gross profit, share of total profit coming from the top 5 trades, monthly returns table, and results per regime (2021 bull, 2022 bear, 2023 recovery, 2024–25, 2026).

**Baselines in every report:**
1. Buy & hold (same asset, same period).
2. **Random-entry baseline:** the same number of trades, the same holding-period distribution and the same exits, at random entry times, 1,000 runs. The strategy must beat the 95th percentile of this distribution, otherwise it has no timing skill.
3. Zero (cash).

### 6.3 Robustness gauntlet (`robustness.py`)
Run on every candidate that looks positive OOS:
- Fees 2× and 3×, slippage 2×.
- Each parameter ±20%: performance should degrade gently (a plateau). A lone sharp peak = overfit.
- Remove the 5 best trades: is it still positive?
- Shift the start date by 1, 2, 3 months.
- Run on every other asset in the universe, unchanged parameters.
- Run on the adjacent timeframe (4h ↔ 1d).
- Check each regime separately: profitable in at least 3 of 5.

### 6.4 Leakage and bug checks (must pass before any result is trusted)
- **Truncation test:** for 20 random cut points *t*, compute signals on `data[:t]` and on the full data. Every signal before *t* must be identical. Any difference = look-ahead.
- **Canary:** a deliberately leaky strategy (peeks at the next bar) must produce absurd results. This confirms the harness would actually show a leak.
- **Sanity strategies:** always-long ≈ buy & hold minus one round trip; random strategy ≈ −costs on average; flat strategy = exactly 0.
- **Hand-calculated test:** a 10-bar synthetic dataset with 2 trades whose P&L is computed by hand in the test file.
- **Second implementation:** re-implement one finalist in vectorbt (or a separate minimal loop). Both must agree within rounding.

---

## 7. Statistics (`stats.py`)

- **Bootstrap CIs:** stationary block bootstrap (blocks of about 1 week of bars) on per-bar returns, plus a plain bootstrap on per-trade R. Report 95% CIs for expectancy and Sharpe.
- **Permutation test:** p-value = share of the random-entry baseline runs (Section 6.2) that match or beat the strategy.
- **Benjamini–Hochberg FDR** when testing many buckets or assets at once (H6).
- **Deflated Sharpe Ratio** (Bailey & López de Prado, 2014), using the **total trial count from `trials.csv`**:

```
SR    = per-period Sharpe of the candidate (not annualized)
T     = number of return observations
g3,g4 = skewness and kurtosis (non-excess) of the returns
N     = number of trials so far, V = variance of the Sharpe ratios across trials
gamma = 0.5772156649 (Euler–Mascheroni)

SR0 = sqrt(V) * ((1-gamma) * Phi^-1(1 - 1/N) + gamma * Phi^-1(1 - 1/(N*e)))
DSR = Phi( (SR - SR0) * sqrt(T - 1) / sqrt(1 - g3*SR + ((g4 - 1)/4) * SR^2) )
```

  DSR is the probability that the true Sharpe is above zero after accounting for how many things were tried. Use `scipy.stats.norm` for Phi.

- **Walk-forward (`walkforward.py`):** on Development + Validation, roll a training window (e.g., 2 years), choose parameters on train only, test on the next 3 months, step forward 3 months. Concatenate **only the test windows** into the OOS equity curve.

---

## 8. Gates

A strategy advances only if it passes **every** gate, in order.

**Gate A — Walk-forward OOS (Development data)**
- OOS expectancy > 0 after **2×** fees.
- ≥ 200 OOS trades (≥ 100 for 1d strategies; report the uncertainty either way).
- Beats the random-entry baseline at p < 0.05.
- Passes all leakage checks (6.4).

**Gate B — Robustness (6.3)**
- Survives fees 3× with expectancy ≥ 0.
- Parameter plateau, not a peak.
- Positive on the majority of assets and in ≥ 3 of 5 regimes.
- Still positive with the top 5 trades removed.

**Gate C — Validation period**
- Validation expectancy's 95% CI lower bound > 0, **or** a positive point estimate plus DSR > 0.95.
- Max drawdown no worse than 1.5× the walk-forward max drawdown.

**Gate D — Independent review**
- Spawn a **fresh reviewer subagent** that has not seen the development process. Give it only the code, `config.yaml`, `trials.csv` and the reports. Ask it to find look-ahead, cost errors and selection bias. Fix anything it finds, log the fix as new trials, and re-run Gates A–C.

**Gate E — Sealed holdout (once)**
- One run. Record it in `trials.csv`. A pass = positive expectancy after real fees, within the validation CI range. No tweaking afterwards. If it fails, the strategy is dead.

**Then:** compute fractional Kelly (F2) for the survivors.

---

## 9. Paper trading (`src/paper/`)

Only for strategies that passed Gate E. Paper trading is **forward-only**; it never touches history.

- `broker.py` — PaperBroker using **live MEXC public data**: market orders fill at the current best ask/bid plus slippage, limit orders fill only if price trades through them, real fee schedule applied, funding applied for perps. State in SQLite: orders, fills, positions, equity snapshots.
- `runner.py` — on each bar close (scheduled job): fetch the latest closed bar, compute signals with **the same strategy code as the backtest** (import it, don't copy it), send orders to the PaperBroker, log everything.
- `monitor.py` — daily:
  - Compare live paper stats with the backtest OOS distribution. Is live expectancy inside the bootstrap band?
  - Measure **tracking error:** paper fill prices vs. the prices the backtest would have assumed for the same bars.
  - **SPRT kill switch** on per-trade R: H0 mean = 0 vs H1 mean = half the OOS backtest mean, sigma from the backtest, alpha = beta = 0.05. Log-likelihood ratio per trade: `((x - mu0)^2 - (x - mu1)^2) / (2 * sigma^2)`, summed. Upper boundary `ln((1-beta)/alpha)`, lower boundary `ln(beta/(1-alpha))`. Crossing the lower boundary = edge not confirmed, stop the strategy.
  - Hard kill if the drawdown exceeds 1.5× the backtest's 95th-percentile max drawdown.
- Minimum run: **8 weeks**, or until the SPRT decides, whichever is later.
- Weekly markdown report to `results/reports/paper_YYYY-WW.md`.

---

## 10. Phases and checkpoints

Stop at the end of each phase, show me a short summary, and wait for "continue".

1. **Setup:** questions (Section 0), CLAUDE.md, project skeleton, config.
2. **Data:** download, validate, splits, data quality report.
3. **Engine + tests:** engine, metrics, every check in 6.4 passing. Show me the hand-calculated test.
4. **Baselines:** buy & hold and the random-entry baseline for every asset.
5. **Hypotheses:** write HYPOTHESES.md, show it to me **before** running anything.
6. **Research runs:** H1–H6 + overlays through Gates A–B. Report survivors **and** casualties.
7. **Validation + review:** Gates C–D.
8. **Holdout:** Gate E, once per finalist.
9. **Paper trading:** build and start the runner for the survivors.
10. **Final report:** what survived, what died and why, realistic return and drawdown ranges with CIs, recommended position sizing.

---

## 11. Expectations (read this before judging the results)

- **Most hypotheses will die.** That is the system working, not failing.
- A realistic good outcome: OOS Sharpe 0.7–1.5, maximum drawdown 15–35%, win rate anywhere from 35% to 60%. Often a better risk-adjusted return than buy & hold, not a money printer.
- If nothing survives, that is a valid and useful result: it means the viral claims don't hold up on this data with honest costs.
- Anything that looks spectacular is a bug until Section 6.4 says otherwise.
