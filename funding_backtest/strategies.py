"""Strategies decide *target weights* (fraction of equity per coin) at the close of each hour.

The engine calls `decide(t, tradable)` after hour t has closed and executes the result at
the open of hour t+1. Signals are built only from funding that has already settled at or
before hour t, so there is no lookahead.

decide() returns:
    dict {coin_index: weight}  -> new targets (coins not in the dict are closed)
    None                       -> keep current positions as they are
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from config import PassiveParams, RotationParams, ThresholdParams


def funding_signal(panel, lookback_hours: int = 24, kind: str = "avg") -> pd.DataFrame:
    """Annualized funding known at the close of each hour.

    "avg":  mean of the settlements in the last `lookback_hours` hours (works for 1h/4h/8h coins,
            since each settlement is annualized with its own interval).
    "last": the most recent settled rate.
    """
    apr = panel.funding_apr
    if kind == "last":
        return apr.ffill()
    return apr.rolling(lookback_hours, min_periods=1).mean().ffill()


class Strategy:
    name = "strategy"

    def prepare(self, panel) -> None:
        """Pre-compute signals and reset state. Called once at the start of every run."""

    def decide(self, t: int, tradable: np.ndarray) -> dict | None:
        raise NotImplementedError

    def params(self) -> dict:
        return {}


class Passive(Strategy):
    """Always hold the basis trade in one coin (default BTC)."""

    def __init__(self, p: PassiveParams | None = None, name: str | None = None):
        self.p = p or PassiveParams()
        self.name = name or f"Passive {self.p.coin}"

    def prepare(self, panel):
        self.ci = panel.coins.index(self.p.coin)

    def decide(self, t, tradable):
        return {self.ci: 1.0} if tradable[self.ci] else None

    def params(self):
        return {"coin": self.p.coin}


class Threshold(Strategy):
    """Enter when annualized funding > X, exit when < Y (hysteresis). Idle cash earns savings."""

    def __init__(self, p: ThresholdParams | None = None, name: str | None = None):
        self.p = p or ThresholdParams()
        self.name = name or f"Threshold {self.p.coin}"

    def prepare(self, panel):
        self.ci = panel.coins.index(self.p.coin)
        sig = funding_signal(panel, self.p.lookback_hours, self.p.signal)
        self.sig = sig[self.p.coin].to_numpy()
        self.on = False

    def decide(self, t, tradable):
        s = self.sig[t]
        if np.isnan(s) or not tradable[self.ci]:
            return None
        if not self.on and s > self.p.enter_apr:
            self.on = True
        elif self.on and s < self.p.exit_apr:
            self.on = False
        return {self.ci: 1.0} if self.on else {}

    def params(self):
        return {"coin": self.p.coin, "X_enter": self.p.enter_apr, "Y_exit": self.p.exit_apr,
                "signal": self.p.signal, "lookback_h": self.p.lookback_hours}


class Rotation(Strategy):
    """Every K hours hold the top N coins by trailing funding, max `max_weight` each.

    Only coins in that month's universe, with live spot+perp markets and funding above
    `min_apr`, are candidates. Unused capital stays in cash (earning savings).
    """

    def __init__(self, p: RotationParams | None = None, name: str | None = None):
        self.p = p or RotationParams()
        self.name = name or f"Rotation top{self.p.top_n}"

    def prepare(self, panel):
        self.sig = funding_signal(panel, self.p.lookback_hours, "avg").to_numpy()

    def decide(self, t, tradable):
        if t % self.p.rebalance_hours != 0:
            return None
        s = np.where(tradable, self.sig[t], np.nan)
        s = np.where(s > self.p.min_apr, s, np.nan)
        valid = np.flatnonzero(~np.isnan(s))
        picks = valid[np.argsort(-s[valid])][: self.p.top_n]
        w = min(1.0 / self.p.top_n, self.p.max_weight)
        return {int(c): w for c in picks}

    def params(self):
        return {"N": self.p.top_n, "K_hours": self.p.rebalance_hours, "max_w": self.p.max_weight,
                "lookback_h": self.p.lookback_hours, "min_apr": self.p.min_apr}
