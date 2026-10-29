# QUANT LAB: standing instructions

The full spec is in `QUANT_LAB_SPEC.md`. Work in the phases of spec Section 10, and after each phase stop, summarize, and wait for "continue".

## Standing rules

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

## Setup decisions (Phase 1, 2026-10-29)

The owner accepted the spec defaults. Details are in `config.yaml`.

- **Paper venue:** MEXC spot for directional strategies. MEXC USDT-M perps only for funding carry (H2).
- **Direction:** long/flat on spot. Shorts only as the perp leg of H2.
- **Assets:** BTC, ETH, SOL, plus the 7 most liquid MEXC USDT pairs with history since 2021 (picked in Phase 2).
- **Timeframes:** 1h, 4h, 1d. Nothing below 1h.
- **Paper account:** $10,000, 0.5% risk per trade.
- **History:** Binance public bulk data (data.binance.vision) for research, MEXC for paper execution prices.
- **Paper runner:** the owner's Windows PC, via Windows Task Scheduler. Cloud sessions are temporary and can't host it.
- **Telegram:** off. Log to files only.
- **AI-decides-trades paper track:** decide at Phase 9. Forward-only, per rule 6.
- **Git:** commit and push to the `quant-lab` branch at the end of each phase. No PR unless asked.

## Coding style

Owner: Adam. Python, VS Code, intermediate coder. Keep code readable, comment the non-obvious parts, no clever one-liners.
