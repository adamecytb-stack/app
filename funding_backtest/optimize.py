"""Tune a strategy on in-sample data, then check it on data it never saw.

    python optimize.py --mode basket     # always-invested basket: full grid (512 runs, ~6 min)
    python optimize.py --mode rotation   # funding rotation: 300 random configs + leverage refinement
    python optimize.py --mode rotation --samples 100   # quicker

Selection uses ONLY 2021-01 .. 2023-12 (in-sample). The 2024+ numbers are printed next to it
but never used to pick anything, so they are an honest estimate of how the chosen settings
would have done going forward. Costs stay at the conservative defaults in config.py.

Score = in-sample CAGR, among configs whose in-sample max drawdown is better than -15%.
Basket mode is stricter (the goal there is to avoid losses): it also requires zero liquidations
in the in-sample period.
Writes output/optimize_results.csv (rotation) or output/optimize_basket.csv (basket).
"""
from __future__ import annotations

import argparse
import itertools
import multiprocessing as mp
import random
import time
from dataclasses import replace

import pandas as pd

import report
from config import BacktestConfig, BasketParams, CostConfig, DataConfig, RiskConfig, RotationParams
from data import load_panel
from engine import Engine
from strategies import Basket, Rotation

MAX_DD_IS = -0.15

# ---- rotation: random search, then the top 10 at every leverage
ROTATION_SPACE = {
    "top_n": [3, 5, 8],
    "rebalance_hours": [1, 8, 24, 72],
    "lookback_hours": [24, 72, 168, 336],
    "min_apr": [0.10, 0.20, 0.30, 0.50],
    "exit_apr": [0.0, 0.05, 0.10],
    "hold_mult": [1, 2, 3, None],          # hold_rank = hold_mult * N (None = any rank)
    "min_volume": [0.0, 20e6, 100e6],
}
ROTATION_LEVERAGES = [1.0, 1.5, 2.0, 3.0]

# ---- basket: full grid
PAUSE_RULES = {                            # name -> (pause below, resume above), annualized 7d funding
    "off": (None, 0.0),
    "<0%/>5%": (0.0, 0.05),
    "<-10%/>0%": (-0.10, 0.0),
}
# First basket grid (648 runs) settled guard=85%, top-up ~ swap, and leverage <= 5x; this grid
# tests the loss controls on top: cash reserve with auto-add margin, volatility-scaled leverage,
# and picking the January basket by funding instead of volume.
BASKET_SPACE = {
    "top_n": [1, 2, 3, 5],
    "leverage": [2.0, 3.0, 4.0, 5.0],
    "reserve": [0.0, 0.05, 0.10, 0.20],
    "vol_k": [None, 8.0],
    "select_by": ["volume", "funding"],
    "pause": ["off", "<0%/>5%"],
    "liq_guard": [0.85],
    "liq_action": ["topup"],
}

_ENGINE: Engine | None = None
_BT = BacktestConfig()


def rotation_params(cfg: dict) -> RotationParams:
    hm, n = cfg["hold_mult"], int(cfg["top_n"])
    no_limit = hm is None or hm != hm            # None, or NaN after a round-trip through pandas
    return RotationParams(top_n=n, rebalance_hours=int(cfg["rebalance_hours"]),
                          lookback_hours=int(cfg["lookback_hours"]), min_apr=float(cfg["min_apr"]),
                          exit_apr=float(cfg["exit_apr"]), hold_rank=999 if no_limit else int(hm) * n,
                          min_volume=float(cfg["min_volume"]))


def basket_setup(cfg: dict) -> tuple[BasketParams, RiskConfig]:
    pause_apr, resume_apr = PAUSE_RULES[cfg["pause"]]
    params = BasketParams(top_n=int(cfg["top_n"]), pause_apr=pause_apr, resume_apr=resume_apr,
                          select_by=cfg.get("select_by", "volume"))
    vol_k = cfg.get("vol_k")
    reserve = float(cfg.get("reserve", 0.0))
    risk = replace(RiskConfig(), leverage=float(cfg["leverage"]), rebalance_drift=None,
                   liq_guard=float(cfg["liq_guard"]), liq_action=cfg["liq_action"],
                   reserve_frac=reserve, auto_add_margin=reserve > 0,
                   vol_k=None if vol_k is None or vol_k != vol_k else float(vol_k))
    return params, risk


def evaluate(cfg: dict) -> dict:
    if cfg["mode"] == "basket":
        params, risk = basket_setup(cfg)
        res = _ENGINE.run(Basket(params), risk)
    else:
        res = _ENGINE.run(Rotation(rotation_params(cfg)), replace(RiskConfig(), leverage=cfg["leverage"]))
    full = report.metrics(res, _BT)
    is_ = report.metrics(res, _BT, None, _BT.is_end)
    oos = report.metrics(res, _BT, _BT.oos_start, None)
    return {**cfg,
            "cagr_is": is_["CAGR"], "sharpe_is": is_["Sharpe"], "max_dd_is": is_["Max drawdown"],
            "cagr_oos": oos["CAGR"], "sharpe_oos": oos["Sharpe"], "max_dd_oos": oos["Max drawdown"],
            "liq_is": is_["Liquidations"], "liq_oos": oos["Liquidations"],
            "cagr": full["CAGR"], "max_dd": full["Max drawdown"], "liquidations": full["Liquidations"],
            "funding": full["Funding earned"], "costs": full["Fees + slippage"],
            "exposure": full["Avg exposure"], "positions": len(res.events)}


def score(row) -> float:
    if row["max_dd_is"] <= MAX_DD_IS:
        return -1.0
    if row["mode"] == "basket" and row["liq_is"] > 0:
        return -1.0 + row["cagr_is"] / 100        # ranked below every liquidation-free config
    return row["cagr_is"]


def run_pool(cfgs: list[dict], label: str) -> pd.DataFrame:
    t0, rows = time.time(), []
    with mp.get_context("fork").Pool(4) as pool:
        for i, r in enumerate(pool.imap_unordered(evaluate, cfgs), 1):
            rows.append(r)
            if i % 50 == 0 or i == len(cfgs):
                print(f"  {label}: {i}/{len(cfgs)} ({time.time() - t0:.0f}s)", flush=True)
    df = pd.DataFrame(rows)
    df["score"] = df.apply(score, axis=1)
    return df


def search_rotation(samples: int, seed: int) -> pd.DataFrame:
    rng = random.Random(seed)
    seen, cfgs = set(), []
    while len(cfgs) < samples:
        c = {k: rng.choice(v) for k, v in ROTATION_SPACE.items()}
        if c["exit_apr"] >= c["min_apr"] or tuple(c.values()) in seen:
            continue
        seen.add(tuple(c.values()))
        cfgs.append({"mode": "rotation", **c, "leverage": RiskConfig().leverage})
    print(f"Stage 1: {len(cfgs)} random configs at leverage {RiskConfig().leverage}")
    s1 = run_pool(cfgs, "stage 1")
    top = s1.sort_values("score", ascending=False).head(10)
    cfgs2 = [{"mode": "rotation", **{k: r[k] for k in ROTATION_SPACE}, "leverage": L}
             for _, r in top.iterrows() for L in ROTATION_LEVERAGES if L != RiskConfig().leverage]
    print(f"Stage 2: {len(cfgs2)} leverage variants of the top 10")
    return pd.concat([s1, run_pool(cfgs2, "stage 2")], ignore_index=True)


def search_basket() -> pd.DataFrame:
    keys = list(BASKET_SPACE)
    cfgs = [{"mode": "basket", **dict(zip(keys, vals))} for vals in itertools.product(*BASKET_SPACE.values())]
    print(f"Basket grid: {len(cfgs)} configs")
    return run_pool(cfgs, "basket")


def main():
    global _ENGINE
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["rotation", "basket"], default="rotation")
    ap.add_argument("--samples", type=int, default=300)
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()

    _ENGINE = Engine(load_panel(DataConfig()), CostConfig(), _BT)
    if args.mode == "basket":
        df, out = search_basket(), "optimize_basket.csv"
        cols = list(BASKET_SPACE)
    else:
        df, out = search_rotation(args.samples, args.seed), "optimize_results.csv"
        cols = list(ROTATION_SPACE) + ["leverage"]

    df = df.sort_values("score", ascending=False).reset_index(drop=True)
    df.to_csv(_BT.output_dir / out, index=False)

    show = df.head(15)[cols + ["cagr_is", "max_dd_is", "liq_is", "cagr_oos", "max_dd_oos", "liq_oos", "positions"]].copy()
    for c in ["cagr_is", "max_dd_is", "cagr_oos", "max_dd_oos"]:
        show[c] = show[c].map(lambda v: f"{v:+.1%}")
    print(f"\nTop 15 by in-sample score (2021-2023) - out-of-sample (2024+) shown, not used:")
    print(show.to_string(index=False))
    beat_is = (df["cagr_is"] > _BT.savings_apy).mean()
    beat_oos = (df["cagr_oos"] > _BT.savings_apy).mean()
    print(f"\nShare of all {len(df)} configs beating 2.5% savings: in-sample {beat_is:.0%}, "
          f"out-of-sample {beat_oos:.0%}")
    best = df.iloc[0]
    print("\nChosen (best in-sample):", {k: best[k] for k in cols})
    print(f"  in-sample CAGR {best['cagr_is']:+.1%} (DD {best['max_dd_is']:.1%}), "
          f"out-of-sample CAGR {best['cagr_oos']:+.1%} (DD {best['max_dd_oos']:.1%})")


if __name__ == "__main__":
    main()
