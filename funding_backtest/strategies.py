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

from config import BasketParams, PassiveParams, RotationParams, ThresholdParams


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

    def on_forced_exit(self, coin: int, cause: str) -> None:
        """The engine closed a position on its own (liquidation, stop, swap, data end)."""

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
    """Every K hours hold up to N coins with the highest trailing funding, max `max_weight` each.

    Entry: coin is in that month's universe, has live spot+perp markets, trailing funding above
    `min_apr` and enough volume (`min_volume`). Free slots go to the best such coins.
    Hold: a coin already held is kept while its funding stays above `exit_apr` and its rank stays
    within `hold_rank` - this hysteresis is what keeps turnover (and fees) down.
    With exit_apr=None and hold_rank=None it is the plain "top N every K hours" rotation.
    Unused capital stays in cash (earning savings).
    """

    def __init__(self, p: RotationParams | None = None, name: str | None = None):
        self.p = p or RotationParams()
        self.name = name or f"Rotation top{self.p.top_n}"

    def prepare(self, panel):
        self.sig = funding_signal(panel, self.p.lookback_hours, "avg").to_numpy()
        # Trailing 24h volume of the thinner leg: liquidity filter and tie-breaker (many coins sit
        # exactly at Binance's default 0.01%/8h = 10.95% APR, so ties are common).
        v = np.minimum(panel.perp_qvol.rolling(24, min_periods=12).sum().to_numpy(),
                       panel.spot_qvol.rolling(24, min_periods=12).sum().to_numpy())
        self.vol = np.nan_to_num(v)
        self.held: list[int] = []

    def decide(self, t, tradable):
        p = self.p
        if t % p.rebalance_hours != 0:
            return None
        ok = tradable & ~np.isnan(self.sig[t])
        s = np.where(ok, self.sig[t], -np.inf)
        order = np.lexsort((-self.vol[t], -s))          # by funding, then by volume
        rank = np.empty_like(order)
        rank[order] = np.arange(len(order))
        exit_apr = p.min_apr if p.exit_apr is None else p.exit_apr
        hold_rank = p.top_n if p.hold_rank is None else p.hold_rank
        keep = [c for c in self.held if ok[c] and s[c] > exit_apr and rank[c] < hold_rank]
        keep = sorted(keep, key=lambda c: rank[c])[: p.top_n]
        for c in order:
            if len(keep) >= p.top_n or s[c] <= p.min_apr:
                break
            if c in keep or self.vol[t, c] < p.min_volume:
                continue
            keep.append(int(c))
        self.held = keep
        w = min(1.0 / p.top_n, p.max_weight)
        return {c: w for c in keep}

    def params(self):
        return {"N": self.p.top_n, "K_hours": self.p.rebalance_hours, "max_w": self.p.max_weight,
                "lookback_h": self.p.lookback_hours, "min_apr": self.p.min_apr,
                "exit_apr": self.p.exit_apr, "hold_rank": self.p.hold_rank,
                "min_volume": self.p.min_volume}


class Basket(Strategy):
    """Always-invested, equal-weight basket of the N biggest coins by volume. No rotation.

    Every January the N biggest coins (by December perp volume, i.e. the order of that month's
    universe) are picked and held all year. A coin only leaves the basket when the engine forces
    it out (swap near liquidation, liquidation, or its market data ends); its slot then goes to
    the biggest coin in the *current* month's universe that isn't held or banned. A coin forced out
    is banned for `ban_hours`. Optionally a coin is paused (its slice waits in savings) while its
    trailing funding is below `pause_apr`, and resumes above `resume_apr`.
    """

    def __init__(self, p: BasketParams | None = None, name: str | None = None):
        self.p = p or BasketParams()
        self.name = name or f"Basket top{self.p.top_n}"

    def prepare(self, panel):
        self.coin_ix = {c: i for i, c in enumerate(panel.coins)}
        self.months = panel.index.strftime("%Y-%m")
        self.new_year = (panel.index.month == 1) & (panel.index.day == 1) & (panel.index.hour == 0)
        self.universe = panel.universe
        v24 = np.minimum(panel.perp_qvol.rolling(24, min_periods=12).sum().to_numpy(),
                         panel.spot_qvol.rolling(24, min_periods=12).sum().to_numpy())
        self.valid = (panel.perp_close.notna() & panel.spot_close.notna()).to_numpy() & (np.nan_to_num(v24) > 0)
        self.sig = None
        if self.p.pause_apr is not None:
            self.sig = funding_signal(panel, self.p.pause_lookback_hours, "avg").to_numpy()
        self.sel_sig = None
        if self.p.select_by == "funding":
            self.sel_sig = funding_signal(panel, self.p.select_lookback_hours, "avg").to_numpy()
        self.year_pick: list[int] = []         # this year's picks, in order
        self.t = 0
        self.basket: list[int] = []
        self.banned: dict[int, int] = {}       # coin -> hour index when the ban ends
        self.paused: set[int] = set()
        self.dirty = True

    def on_forced_exit(self, coin, cause):
        self.dirty = True
        if cause in ("swap", "liquidation", "data end"):
            self.banned[coin] = self.t + self.p.ban_hours

    def decide(self, t, tradable):
        self.t = t
        changed = self.dirty
        if t == 0 or self.new_year[t]:
            self.basket, self.banned, self.paused = [], {}, set()
            self.year_pick = self._pick(t)
            changed = True
        banned = {c for c, until in self.banned.items() if until > t}
        keep = [c for c in self.basket if self.valid[t, c] and c not in banned]
        changed |= len(keep) != len(self.basket)
        ranking = [self.coin_ix[c] for c in self.universe.get(self.months[t], []) if c in self.coin_ix]
        for c in self.year_pick + ranking:      # January picks first, then biggest by volume
            if len(keep) >= self.p.top_n:
                break
            if c not in keep and c not in banned and self.valid[t, c]:
                keep.append(c)
                changed = True
        self.basket = keep
        if self.sig is not None:
            for c in keep:
                s = self.sig[t, c]
                if np.isnan(s):
                    continue
                if c in self.paused and s > self.p.resume_apr:
                    self.paused.discard(c)
                    changed = True
                elif c not in self.paused and s < self.p.pause_apr:
                    self.paused.add(c)
                    changed = True
        if not changed:
            return None
        self.dirty = False
        w = 1.0 / max(len(keep), 1)
        return {c: w for c in keep if c not in self.paused}

    def _pick(self, t) -> list[int]:
        """January picks: the N biggest by volume, or the N best payers among the biggest."""
        ranked = [self.coin_ix[c] for c in self.universe.get(self.months[t], []) if c in self.coin_ix]
        ranked = [c for c in ranked if self.valid[t, c]]
        if self.sel_sig is None:
            return ranked[: self.p.top_n]
        pool = ranked[: self.p.select_pool]
        f = {c: self.sel_sig[t, c] for c in pool}
        if all(np.isnan(v) for v in f.values()):            # no funding history yet (first day)
            return pool[: self.p.top_n]
        return sorted(pool, key=lambda c: -np.nan_to_num(f[c], nan=-1e9))[: self.p.top_n]

    def params(self):
        return {"N": self.p.top_n, "pause_apr": self.p.pause_apr, "resume_apr": self.p.resume_apr,
                "pause_lookback_h": self.p.pause_lookback_hours, "ban_h": self.p.ban_hours,
                "select_by": self.p.select_by}
