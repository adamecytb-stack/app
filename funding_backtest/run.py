"""Run the backtest.

    python run.py              # all strategies with the defaults in config.py
    python run.py --grid       # also run the grid search (writes output/grid_results.csv)
    python run.py --refresh    # rebuild the hourly panel from the cache / download new months
"""
from __future__ import annotations

import argparse
import itertools
import time
from dataclasses import replace

import pandas as pd

import report
from config import (BASKET_NO_RESERVE, BASKET_NO_RESERVE_RISK, OPTIMIZED_BASKET,
                    OPTIMIZED_BASKET_RISK, OPTIMIZED_ROTATION,
                    OPTIMIZED_ROTATION_LEVERAGE, BacktestConfig, CostConfig, DataConfig, GridConfig,
                    PassiveParams, RiskConfig, RotationParams, ThresholdParams)
from data import load_panel
from engine import Engine
from strategies import Basket, Passive, Rotation, Threshold


def default_runs():
    """(strategy, risk config) pairs compared in the main report."""
    risk = RiskConfig()
    return [
        (Passive(PassiveParams("BTC")), risk),
        (Threshold(ThresholdParams()), risk),
        (Rotation(RotationParams(), name="Rotation top5 (naive)"), risk),
        (Basket(BASKET_NO_RESERVE, name="Basket (no reserve)"), BASKET_NO_RESERVE_RISK),
        (Rotation(OPTIMIZED_ROTATION, name="Rotation (optimized)"),
         replace(risk, leverage=OPTIMIZED_ROTATION_LEVERAGE)),
        (Basket(OPTIMIZED_BASKET, name="Basket (optimized)"), OPTIMIZED_BASKET_RISK),
    ]


def grid_search(engine: Engine, bt: BacktestConfig, grid: GridConfig) -> pd.DataFrame:
    base = RiskConfig()
    jobs = []
    for L in grid.leverage:
        jobs.append(("Passive", lambda: Passive(PassiveParams("BTC")), {"L": L}, L))
        for X, Y in itertools.product(grid.enter_apr, grid.exit_apr):
            if Y < X:
                jobs.append(("Threshold", lambda X=X, Y=Y: Threshold(ThresholdParams(enter_apr=X, exit_apr=Y)),
                             {"L": L, "X": X, "Y": Y}, L))
        for N, K in itertools.product(grid.top_n, grid.rebalance_hours):
            jobs.append(("Rotation", lambda N=N, K=K: Rotation(RotationParams(top_n=N, rebalance_hours=K)),
                         {"L": L, "N": N, "K": K}, L))
    rows, t0 = [], time.time()
    print(f"\nGrid search: {len(jobs)} runs")
    # Strategies are built lazily: each one holds its own signal arrays (~200 MB for rotation),
    # so creating all of them up front runs out of memory.
    for i, (family, make, params, L) in enumerate(jobs, 1):
        res = engine.run(make(), replace(base, leverage=L))
        full = report.metrics(res, bt)
        is_ = report.metrics(res, bt, None, bt.is_end)
        oos = report.metrics(res, bt, bt.oos_start, None)
        rows.append({"family": family, **params,
                     "cagr": full["CAGR"], "sharpe": full["Sharpe"], "max_dd": full["Max drawdown"],
                     "liquidations": full["Liquidations"], "funding": full["Funding earned"],
                     "costs": full["Fees + slippage"], "deployed": full["Time deployed"],
                     "cagr_is": is_["CAGR"], "sharpe_is": is_["Sharpe"],
                     "cagr_oos": oos["CAGR"], "sharpe_oos": oos["Sharpe"], "max_dd_oos": oos["Max drawdown"]})
        if i % 20 == 0 or i == len(jobs):
            print(f"  {i}/{len(jobs)} ({time.time() - t0:.0f}s)")
    df = pd.DataFrame(rows).sort_values(grid.rank_by, ascending=False).reset_index(drop=True)
    return df


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--grid", action="store_true", help="run the parameter grid search")
    ap.add_argument("--refresh", action="store_true", help="rebuild the panel (fetches new months)")
    ap.add_argument("--no-dashboard", action="store_true", help="don't write docs/data.js")
    args = ap.parse_args()

    dcfg, bt, costs = DataConfig(), BacktestConfig(), CostConfig()
    bt.output_dir.mkdir(parents=True, exist_ok=True)
    panel = load_panel(dcfg, refresh=args.refresh)
    engine = Engine(panel, costs, bt)

    results = []
    for strat, risk in default_runs():
        t0 = time.time()
        results.append(engine.run(strat, risk))
        print(f"ran {strat.name} in {time.time() - t0:.1f}s")

    summ, per, worst, years, roll = report.print_report(results, bt, bt.output_dir)
    report.equity_png(results, bt, bt.output_dir / "equity.png")
    print(f"\nWrote {bt.output_dir / 'equity.png'}")

    grid = None
    if args.grid:
        grid = grid_search(engine, bt, GridConfig())
        grid.to_csv(bt.output_dir / "grid_results.csv", index=False)
        print("\nTop 10 by in-sample Sharpe (2021-2023), with out-of-sample (2024+) next to it:")
        show = grid.head(10).copy()
        for c in ["cagr", "max_dd", "cagr_is", "cagr_oos", "max_dd_oos"]:
            show[c] = show[c].map(lambda v: f"{v:.1%}")
        print(show[["family", "L", "X", "Y", "N", "K", "cagr_is", "sharpe_is", "cagr_oos",
                    "sharpe_oos", "max_dd", "liquidations"]].to_string(index=False))
        print("\nBest per family (in-sample) and how it did out-of-sample:")
        best = grid.groupby("family", sort=False).head(1)
        print(best[["family", "L", "X", "Y", "N", "K", "sharpe_is", "sharpe_oos", "cagr_oos"]].to_string(index=False))
    elif (bt.output_dir / "grid_results.csv").exists():
        grid = pd.read_csv(bt.output_dir / "grid_results.csv")    # keep last grid in the dashboard

    if not args.no_dashboard:
        opt_path, bopt_path = bt.output_dir / "optimize_results.csv", bt.output_dir / "optimize_basket.csv"
        opt = pd.read_csv(opt_path) if opt_path.exists() else None
        bopt = pd.read_csv(bopt_path) if bopt_path.exists() else None
        report.write_dashboard_data(results, bt, panel, summ, per, worst, grid, bt.docs_dir, opt, bopt,
                                    years, roll)
        print(f"Wrote {bt.docs_dir / 'data.js'} (open docs/index.html)")


if __name__ == "__main__":
    main()
