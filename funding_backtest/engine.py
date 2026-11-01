"""Hourly event-driven backtest engine for long-spot / short-perp positions.

Order of operations inside every hour bar t:
    1. Funding settling in this bar is paid on the short held coming into the bar
       (credited to / debited from the position's isolated margin).
    2. Orders decided at the close of bar t-1 are filled at the open of bar t
       (spot and perp at their own open prices, plus fees and size-based slippage).
    3. Liquidation check: perp HIGH of the bar vs the short's liquidation price.
       If hit, the margin is lost and the spot leg is left unhedged.
    4. Spot legs left unhedged by a liquidation in bar t-1 are sold at this bar's close.
    5. Idle cash earns the savings rate.
    6. Mark to market at the close; force-close coins whose data ends (delisting).
    7. Risk rules (optional stop, liquidation guard, drift rebalance) and the strategy decide
       orders for bar t+1. Positions the engine closes on its own (liquidation, stop, swap, data
       end) are reported to the strategy via strategy.on_forced_exit(coin, cause).

Sizing for capital C at leverage L (spot qty == short qty == q):
    q = C / (spot + perp / L)      -> spot value = q*spot, perp-leg equity = q*perp/L
Isolated short liquidation price:
    p_liq = (margin + q*entry) / (q * (1 + mmr))
"""
from __future__ import annotations

import math
from dataclasses import asdict, dataclass, field

import numpy as np
import pandas as pd

from config import BacktestConfig, CostConfig, RiskConfig

CASH_BUFFER = 0.995    # target 99.5% of equity at most, so fees don't push cash negative


@dataclass
class Position:
    coin: int
    q: float = 0.0             # spot quantity == short quantity (perp contract units)
    entry: float = 0.0         # average short entry price
    margin: float = 0.0        # isolated margin (incl. funding received)
    open_price: float = 0.0    # perp price when the position was opened (stop rule)
    ref_price: float = 0.0     # perp price at the last (re)balance (drift rule)
    opened_at: int = 0
    hedged: bool = True
    liq_bar: int = -1
    liq_price: float = 0.0
    value_before_event: float = 0.0   # hedged value just before a liquidation
    cash_flow: float = 0.0     # net cash this position has put in (-) / taken out (+)
    funding: float = 0.0
    fees: float = 0.0
    slippage: float = 0.0
    rebalances: int = 0
    lev: float = 1.5           # this position's short leverage (can differ per coin)
    auto_added: float = 0.0    # margin moved in from the cash reserve since the last (re)balance

    def value(self, ps: float, pp: float) -> float:
        v = self.q * ps
        if self.hedged:
            v += self.margin + self.q * (self.entry - pp)
        return v


@dataclass
class Result:
    name: str
    params: dict
    equity: pd.Series
    deployed: pd.Series          # fraction of equity in positions, per hour
    events: pd.DataFrame         # closed positions and risk events
    flows: pd.DataFrame          # hourly funding received and trading costs paid
    totals: dict = field(default_factory=dict)


class Engine:
    """Holds the numpy version of the panel so many runs (grid search) can reuse it."""

    def __init__(self, panel, costs: CostConfig | None = None, bt: BacktestConfig | None = None):
        self.panel, self.costs, self.bt = panel, costs or CostConfig(), bt or BacktestConfig()
        self.index = panel.index
        self.coins = panel.coins
        pc_ff, sc_ff = panel.perp_close.ffill(), panel.spot_close.ffill()
        self.pc, self.sc = pc_ff.to_numpy(), sc_ff.to_numpy()
        # Fill price for an order placed at the close of t-1: the open of t (or last close if missing).
        self.po = panel.perp_open.fillna(pc_ff.shift(1)).to_numpy()
        self.so = panel.spot_open.fillna(sc_ff.shift(1)).to_numpy()
        self.ph = panel.perp_high.fillna(pc_ff).to_numpy()
        self.has_open = (panel.perp_open.notna() & panel.spot_open.notna()).to_numpy()
        # Trailing 24h quote volume, known at the close of each bar (used for slippage at the next open).
        self.pv24 = panel.perp_qvol.rolling(24, min_periods=12).sum().to_numpy()
        self.sv24 = panel.spot_qvol.rolling(24, min_periods=12).sum().to_numpy()
        self.fr = panel.funding_rate.fillna(0.0).to_numpy()
        # Trailing 30-day daily volatility of each perp (known at the close of each bar), used by
        # the optional volatility-scaled leverage.
        logret = np.log(pc_ff).diff()
        self.vol_d = (logret.rolling(720, min_periods=240).std() * np.sqrt(24)).to_numpy()
        valid = (panel.perp_close.notna() & panel.spot_close.notna())
        self.tradable = (valid & panel.in_universe.astype(bool)
                         & (self.pv24 > 0) & (self.sv24 > 0)).to_numpy()
        vnp = valid.to_numpy()
        T = len(self.index)
        self.last_valid = np.array([T - 1 - np.argmax(vnp[::-1, c]) if vnp[:, c].any() else -1
                                    for c in range(vnp.shape[1])])

    # ------------------------------------------------------------------ helpers
    def _slip(self, notional: float, vol24: float) -> float:
        c = self.costs
        if not vol24 or vol24 != vol24 or vol24 <= 0:
            return c.slip_cap_bps / 1e4
        bps = c.slip_base_bps + c.slip_impact_bps * math.sqrt(notional / vol24)
        return min(bps, c.slip_cap_bps) / 1e4

    def run(self, strategy, risk: RiskConfig | None = None) -> Result:
        risk = risk or RiskConfig()
        c_ = self.costs
        L, mmr = risk.leverage, risk.mmr
        T, idx = len(self.index), self.index
        pc, sc, po, so, ph, fr = self.pc, self.sc, self.po, self.so, self.ph, self.fr
        r_h = (1 + self.bt.savings_apy) ** (1 / 8760) - 1

        cash = self.bt.initial_capital
        pos: dict[int, Position] = {}
        events: list[dict] = []
        tot = dict(funding=0.0, fees=0.0, slippage=0.0, interest=0.0, liquidations=0,
                   stops=0, swaps=0, rebalances=0, data_end_closes=0, trades=0,
                   auto_margin_events=0, auto_margin_added=0.0)
        scale = CASH_BUFFER * (1 - risk.reserve_frac)     # share of equity put into positions
        last_targets: dict = {}

        def lev_for(c: int, t: int) -> float:
            """Short leverage for coin c when (re)sizing at the open of bar t."""
            if risk.vol_k is None:
                return L
            v = self.vol_d[max(t - 1, 0), c]
            if not v > 0:                     # no 30-day history yet (new listing): be careful
                return min(L, 1.5)
            # liquidation distance ~ 1/lev; keep it at least vol_k daily standard deviations away
            return float(min(L, max(1.0, 1.0 / (risk.vol_k * v))))
        equity = np.empty(T)
        deployed = np.empty(T)
        fund_h = np.zeros(T)
        cost_h = np.zeros(T)
        orders: tuple | None = None
        strategy.prepare(self.panel)

        # ---------------- trade helpers (closures keep the hot loop readable)
        def trade(p: Position, q_new: float, t: int, ps: float, pp: float, reset_perp: bool):
            """Move position p to quantity q_new at prices (ps, pp). Margin set to target leverage."""
            nonlocal cash
            vs, vp = self.sv24[max(t - 1, 0), p.coin], self.pv24[max(t - 1, 0), p.coin]
            flow = fees = slip = 0.0
            dq = q_new - p.q
            if dq != 0:
                n = abs(dq) * ps
                s = self._slip(n, vs)
                flow += -n * (1 + s) if dq > 0 else n * (1 - s)
                fees += n * c_.spot_fee
                slip += n * s
            # Perp leg. A full reset (cover everything, re-short q_new) realizes the PnL, which
            # is needed when unrealized profit is too big to leave the margin at target.
            Lp = p.lev
            target_m = q_new * pp / Lp - q_new * (p.entry - pp) if p.q > 0 else q_new * pp / Lp
            if p.q > 0 and q_new > 0 and target_m < 0:
                reset_perp = True
            legs = [(-p.q, p.q), (q_new, 0.0)] if (reset_perp and p.q > 0) else [(dq, p.q)]
            for d, q_before in legs:
                if d == 0:
                    continue
                n = abs(d) * pp
                s = self._slip(n, vp)
                fees += n * c_.perp_fee
                slip += n * s
                if d > 0:                                   # sell (add to short)
                    px = pp * (1 - s)
                    p.entry = (q_before * p.entry + d * px) / (q_before + d) if q_before + d > 0 else px
                else:                                       # buy back (reduce short)
                    px = pp * (1 + s)
                    p.margin += -d * (p.entry - px)
                    if q_before + d <= 1e-12:
                        p.entry = 0.0
            p.q = q_new
            target_m = q_new * pp / Lp - q_new * (p.entry - pp) if q_new > 0 else 0.0
            flow -= target_m - p.margin
            p.auto_added = 0.0
            p.margin = target_m
            flow -= fees
            cash += flow
            p.cash_flow += flow
            p.fees += fees
            p.slippage += slip
            tot["fees"] += fees
            tot["slippage"] += slip
            tot["trades"] += 1
            cost_h[t] += fees + slip
            p.ref_price = pp

        def sell_unhedged_spot(p: Position, t: int, ps: float) -> float:
            nonlocal cash
            n = p.q * ps
            s = self._slip(n, self.sv24[t, p.coin])
            fee = n * c_.spot_fee
            flow = n * (1 - s) - fee
            cash += flow
            p.cash_flow += flow
            p.fees += fee
            p.slippage += n * s
            tot["fees"] += fee
            tot["slippage"] += n * s
            cost_h[t] += fee + n * s
            p.q = 0.0
            return flow

        def close(p: Position, t: int, ps: float, pp: float, cause: str):
            """Close both legs (or the leftover spot after a liquidation) and log the event."""
            event_loss = np.nan
            if p.hedged:
                trade(p, 0.0, t, ps, pp, reset_perp=False)
            else:
                proceeds = sell_unhedged_spot(p, t, ps)
                # What the liquidation itself cost: hedged value just before vs cash recovered.
                event_loss = p.value_before_event - proceeds
            del pos[p.coin]
            pnl = p.cash_flow
            price_move = pp / p.open_price - 1 if p.open_price else 0.0
            if cause == "liquidation":
                detail = f"short liquidated (high >= {p.liq_price:.6g}), spot sold unhedged"
            elif cause == "stop":
                detail = f"stop: price {price_move:+.0%} from entry"
            elif cause == "data end":
                detail = "market data ends (delisted, or left the downloaded top-30 window)"
            elif cause == "swap":
                detail = f"closed near liquidation ({price_move:+.0%} from entry), capital moved on"
            else:   # normal exit: name the biggest negative contributor
                trading = pnl - p.funding + p.fees + p.slippage
                parts = {"negative funding": p.funding, "trading costs": -(p.fees + p.slippage),
                         "basis / price gap": trading}
                detail = min(parts, key=parts.get) if pnl < 0 else "profit"
            events.append(dict(
                time=idx[t], opened=idx[p.opened_at], coin=self.coins[p.coin], cause=cause,
                detail=detail, pnl=pnl, event_loss=event_loss, funding=p.funding, fees=p.fees,
                slippage=p.slippage, price_move=price_move, hours=t - p.opened_at,
                rebalances=p.rebalances))
            if cause in ("liquidation", "stop", "data end"):
                strategy.on_forced_exit(p.coin, cause)

        # ---------------- main loop
        for t in range(T):
            # 1. funding on positions held coming into this bar
            for p in pos.values():
                rate = fr[t, p.coin]
                if p.hedged and rate != 0.0:
                    amt = rate * p.q * po[t, p.coin]
                    p.margin += amt
                    p.funding += amt
                    tot["funding"] += amt
                    fund_h[t] += amt

            # 2. fill orders from the previous close at this bar's open
            if orders is not None:
                targets, forced = orders
                eq_open = cash + sum(p.value(so[t, c], po[t, c]) for c, p in pos.items())
                for c, p in list(pos.items()):
                    if not p.hedged:
                        continue
                    if forced.get(c) in ("stop", "swap"):
                        close(p, t, so[t, c], po[t, c], forced[c])
                        tot["stops" if forced[c] == "stop" else "swaps"] += 1
                    elif targets is not None and targets.get(c, 0.0) <= 0.0:
                        close(p, t, so[t, c], po[t, c], "strategy exit")
                desired: dict[int, float] = {}
                if targets is not None:
                    for c, w in targets.items():
                        if w > 0 and forced.get(c) not in ("stop", "swap") and self.has_open[t, c] and \
                                (c not in pos or pos[c].hedged):
                            desired[c] = w * eq_open * scale
                for c, p in pos.items():
                    if p.hedged and c not in desired and forced.get(c) == "rebalance":
                        # back to the strategy's target size (this also refills the cash reserve)
                        w = last_targets.get(c)
                        desired[c] = w * eq_open * scale if w else p.value(so[t, c], po[t, c])
                # reductions first so they free up cash for increases
                cur = {c: (pos[c].value(so[t, c], po[t, c]) if c in pos else 0.0) for c in desired}
                for c in sorted(desired, key=lambda k: desired[k] - cur[k]):
                    C, V = desired[c], cur[c]
                    is_rebal = forced.get(c) == "rebalance"
                    if c in pos and not is_rebal and abs(C - V) < risk.min_trade_frac * eq_open:
                        continue
                    ps, pp = so[t, c], po[t, c]
                    lev = lev_for(c, t)
                    q_new = C / (ps + pp / lev)
                    if c not in pos:
                        pos[c] = Position(coin=c, open_price=pp, opened_at=t)
                    p = pos[c]
                    p.lev = lev
                    if is_rebal:
                        p.rebalances += 1
                        tot["rebalances"] += 1
                    # Top-ups only trim the short (no full close/re-open); trade() still realizes
                    # the PnL itself when it has to (price fell a lot).
                    trade(p, q_new, t, ps, pp, reset_perp=False)

            # 3. liquidation check on the bar's high
            for c, p in pos.items():
                if p.hedged and p.q > 0:
                    liq = (p.margin + p.q * p.entry) / (p.q * (1 + mmr))
                    if ph[t, c] >= liq and risk.auto_add_margin and cash > 0:
                        # Auto-add margin from the cash reserve (like Binance's auto-add margin):
                        # just enough to keep the liquidation price above this bar's high. No fee.
                        need = ph[t, c] * (1 + mmr) * p.q * 1.002 - p.q * p.entry - p.margin
                        add = min(need, cash)
                        p.margin += add
                        p.auto_added += add
                        p.cash_flow -= add
                        cash -= add
                        tot["auto_margin_events"] += 1
                        tot["auto_margin_added"] += add
                        liq = (p.margin + p.q * p.entry) / (p.q * (1 + mmr))
                    if ph[t, c] >= liq:
                        p.value_before_event = p.value(so[t, c], po[t, c])
                        p.hedged = False
                        p.liq_bar, p.liq_price = t, liq
                        p.margin, p.entry = 0.0, 0.0
                        tot["liquidations"] += 1

            # 4. sell spot left unhedged by a liquidation in the previous bar (at this close)
            for c, p in list(pos.items()):
                if not p.hedged and p.liq_bar == t - 1:
                    close(p, t, sc[t, c], pc[t, c], "liquidation")

            # 5. savings interest on cash (negative cash pays the same rate)
            interest = cash * r_h
            cash += interest
            tot["interest"] += interest

            # 6. data ends for a coin (delisted / out of download window): force close at this close
            for c, p in list(pos.items()):
                if t == self.last_valid[c] and t < T - 1:
                    close(p, t, sc[t, c], pc[t, c], "data end" if p.hedged else "liquidation")
                    tot["data_end_closes"] += 1

            pos_val = sum(p.value(sc[t, c], pc[t, c]) for c, p in pos.items())
            equity[t] = cash + pos_val
            deployed[t] = pos_val / equity[t] if equity[t] > 0 else 0.0

            if equity[t] <= 0:          # blown up: stop trading
                equity[t:] = equity[t]
                deployed[t:] = 0.0
                break

            # 7. risk rules + strategy decision for the next bar
            forced = {}
            for c, p in pos.items():
                if not p.hedged:
                    continue
                if risk.stop_move is not None and abs(pc[t, c] / p.open_price - 1) > risk.stop_move:
                    forced[c] = "stop"
                    continue
                if p.auto_added > 0:              # reserve was used: re-balance and refill it
                    forced[c] = "rebalance"
                    continue
                if risk.liq_guard is not None and pc[t, c] > p.ref_price:
                    # How much of the way from the last (re)balance price to the liquidation price
                    # has the price already covered? Act once it passes liq_guard (e.g. 0.7 = 70%).
                    liq = (p.margin + p.q * p.entry) / (p.q * (1 + mmr))
                    if pc[t, c] - p.ref_price >= risk.liq_guard * (liq - p.ref_price):
                        forced[c] = "rebalance" if risk.liq_action == "topup" else "swap"
                        if forced[c] == "swap":
                            strategy.on_forced_exit(c, "swap")
                        continue
                if risk.rebalance_drift is not None and \
                        abs(pc[t, c] / p.ref_price - 1) > risk.rebalance_drift:
                    forced[c] = "rebalance"
            targets = strategy.decide(t, self.tradable[t])
            if targets is not None:
                last_targets = targets
            orders = (targets, forced) if (targets is not None or forced) else None

        # positions still open at the end are reported (not closed) so totals stay honest
        last = T - 1
        for c, p in list(pos.items()):
            events.append(dict(
                time=idx[last], opened=idx[p.opened_at], coin=self.coins[c], cause="open at end",
                detail="open at end", pnl=p.cash_flow + p.value(sc[last, c], pc[last, c]),
                funding=p.funding, fees=p.fees, slippage=p.slippage,
                price_move=pc[last, c] / p.open_price - 1, hours=last - p.opened_at,
                rebalances=p.rebalances, event_loss=np.nan))

        ev = pd.DataFrame(events)
        return Result(name=strategy.name, params={**strategy.params(), **asdict(risk)},
                      equity=pd.Series(equity, index=idx, name=strategy.name),
                      deployed=pd.Series(deployed, index=idx), events=ev, totals=tot,
                      flows=pd.DataFrame({"funding": fund_h, "costs": cost_h}, index=idx))
