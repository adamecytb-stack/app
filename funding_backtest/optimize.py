"""Tune the rotation strategy on in-sample data, then check it on data it never saw.

    python optimize.py                 # 300 random configs + leverage refinement (~10 min on 4 cores)
    python optimize.py --samples 100   # quicker

Selection uses ONLY 2021-01 .. 2023-12 (in-sample). The 2024+ numbers are printed next to it
but never used to pick anything, so they are an honest estimate of how the chosen settings
would have done going forward. Costs stay at the conservative defaults in config.py.

Score = in-sample CAGR, among configs whose in-sample max drawdown is better than -15%.
Writes output/optimize_results.csv.
"""
from __future__ import annotations

import argparse
import multiprocessing as mp
import random
import time
from dataclasses import asdict, replace

import pandas as pd

import report
from config import BacktestConfig, CostConfig, DataConfig, RiskConfig, RotationParams
from data import load_panel
from engine import Engine
from strategies import Rotation

SPACE = {
    "top_n": [3, 5, 8],
    "rebalance_hours": [1, 8, 24, 72],
    "lookback_hours": [24, 72, 168, 336],
    "min_apr": [0.10, 0.20, 0.30, 0.50],
    "exit_apr": [0.0, 0.05, 0.10],
    "hold_mult": [1, 2, 3, None],          # hold_rank = hold_mult * N (None = any rank)
    "min_volume": [0.0, 20e6, 100e6],
}
LEVERAGES = [1.0, 1.5, 2.0, 3.0]
MAX_DD_IS = -0.15

_ENGINE: Engine | None = None
_BT = BacktestConfig()


def _params(cfg: dict) -> RotationParams:
    hm, n = cfg["hold_mult"], int(cfg["top_n"])
    no_limit = hm is None or hm != hm            # None, or NaN after a round-trip through pandas
    return RotationParams(top_n=n, rebalance_hours=int(cfg["rebalance_hours"]),
                          lookback_hours=int(cfg["lookback_hours"]), min_apr=float(cfg["min_apr"]),
                          exit_apr=float(cfg["exit_apr"]), hold_rank=999 if no_limit else int(hm) * n,
                          min_volume=float(cfg["min_volume"]))


def evaluate(cfg: dict) -> dict:
    res = _ENGINE.run(Rotation(_params(cfg)), replace(RiskConfig(), leverage=cfg["leverage"]))
    full = report.metrics(res, _BT)
    is_ = report.metrics(res, _BT, None, _BT.is_end)
    oos = report.metrics(res, _BT, _BT.oos_start, None)
    return {**cfg,
            "cagr_is": is_["CAGR"], "sharpe_is": is_["Sharpe"], "max_dd_is": is_["Max drawdown"],
            "cagr_oos": oos["CAGR"], "sharpe_oos": oos["Sharpe"], "max_dd_oos": oos["Max drawdown"],
            "cagr": full["CAGR"], "max_dd": full["Max drawdown"], "liquidations": full["Liquidations"],
            "funding": full["Funding earned"], "costs": full["Fees + slippage"],
            "exposure": full["Avg exposure"], "positions": len(res.events)}


def score(row) -> float:
    return row["cagr_is"] if row["max_dd_is"] > MAX_DD_IS else -1.0


def run_pool(cfgs: list[dict], label: str) -> pd.DataFrame:
    t0, rows = time.time(), []
    with mp.get_context("fork").Pool(4) as pool:
        for i, r in enumerate(pool.imap_unordered(evaluate, cfgs), 1):
            rows.append(r)
            if i % 25 == 0 or i == len(cfgs):
                print(f"  {label}: {i}/{len(cfgs)} ({time.time() - t0:.0f}s)", flush=True)
    df = pd.DataFrame(rows)
    df["score"] = df.apply(score, axis=1)
    return df


def main():
    global _ENGINE
    ap = argparse.ArgumentParser()
    ap.add_argument("--samples", type=int, default=300)
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()

    _ENGINE = Engine(load_panel(DataConfig()), CostConfig(), _BT)

    # Stage 1: random search over the turnover controls at the default leverage.
    rng = random.Random(args.seed)
    seen, cfgs = set(), []
    while len(cfgs) < args.samples:
        c = {k: rng.choice(v) for k, v in SPACE.items()}
        if c["exit_apr"] >= c["min_apr"]:
            continue
        key = tuple(c.values())
        if key in seen:
            continue
        seen.add(key)
        cfgs.append({**c, "leverage": RiskConfig().leverage})
    print(f"Stage 1: {len(cfgs)} random configs at leverage {RiskConfig().leverage}")
    s1 = run_pool(cfgs, "stage 1")

    # Stage 2: the 10 best in-sample configs at every leverage.
    top = s1.sort_values("score", ascending=False).head(10)
    cfgs2 = [{**{k: r[k] for k in SPACE}, "leverage": L} for _, r in top.iterrows() for L in LEVERAGES
             if L != RiskConfig().leverage]
    print(f"Stage 2: {len(cfgs2)} leverage variants of the top 10")
    s2 = run_pool(cfgs2, "stage 2")

    df = pd.concat([s1, s2], ignore_index=True).sort_values("score", ascending=False)
    df.to_csv(_BT.output_dir / "optimize_results.csv", index=False)

    cols = ["top_n", "rebalance_hours", "lookback_hours", "min_apr", "exit_apr", "hold_mult",
            "min_volume", "leverage", "cagr_is", "max_dd_is", "cagr_oos", "max_dd_oos", "sharpe_oos",
            "liquidations", "positions"]
    show = df.head(15)[cols].copy()
    for c in ["cagr_is", "max_dd_is", "cagr_oos", "max_dd_oos"]:
        show[c] = show[c].map(lambda v: f"{v:+.1%}")
    print("\nTop 15 by in-sample score (2021-2023) - out-of-sample (2024+) shown, not used:")
    print(show.to_string(index=False))
    n_pos_is = (df["cagr_is"] > _BT.savings_apy).mean()
    n_pos_oos = (df["cagr_oos"] > _BT.savings_apy).mean()
    print(f"\nShare of all {len(df)} configs beating 2.5% savings: in-sample {n_pos_is:.0%}, "
          f"out-of-sample {n_pos_oos:.0%}")
    best = df.iloc[0]
    print("\nChosen (best in-sample):", asdict(_params(best.to_dict())), "leverage", best["leverage"])


if __name__ == "__main__":
    main()
