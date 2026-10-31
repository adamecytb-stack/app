"""Metrics, tables, the equity chart (PNG) and the data file for the GitHub Pages dashboard."""
from __future__ import annotations

import json
import math

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import matplotlib.ticker  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

from config import BacktestConfig  # noqa: E402

PERIODS = {"2021 bull": ("2021-01-01", "2021-12-31"),
           "2022 bear": ("2022-01-01", "2022-12-31"),
           "2023-26": ("2023-01-01", "2026-12-31")}

# Categorical slots (fixed order) from the validated reference palette; savings is a muted reference.
COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"]
SAVINGS_COLOR = "#898781"

SURVIVORSHIP_NOTE = (
    "Survivorship bias: the universe is rebuilt each month from the previous month's top perps by "
    "volume and includes coins later delisted (LUNA, FTT, SRM, ...) because the Binance archive keeps "
    "them. Remaining bias: only Binance is modeled (an exchange that survived, unlike FTX), perps "
    "without a Binance spot pair are excluded, and exchange/counterparty risk is not modeled.")


# --------------------------------------------------------------------------- metrics
def savings_curve(index: pd.DatetimeIndex, bt: BacktestConfig) -> pd.Series:
    hours = np.arange(len(index))
    return pd.Series(bt.initial_capital * (1 + bt.savings_apy) ** (hours / 8760), index=index,
                     name=f"Savings {bt.savings_apy:.1%}")


def _window(s: pd.Series, start=None, end=None) -> pd.Series:
    s = s.loc[start:end] if (start or end) else s
    return s


def metrics(res, bt: BacktestConfig, start=None, end=None) -> dict:
    eq = _window(res.equity, start, end)
    if len(eq) < 48:
        return {}
    i0 = res.equity.index.get_loc(eq.index[0])
    base = res.equity.iloc[i0 - 1] if i0 > 0 else bt.initial_capital
    years = len(eq) / 8760
    total = eq.iloc[-1] / base - 1
    cagr = (1 + total) ** (1 / years) - 1 if total > -1 else -1.0
    curve = pd.concat([pd.Series([base]), eq.reset_index(drop=True)])
    dd = (curve / curve.cummax() - 1).min()
    daily = eq.resample("1D").last()
    daily = pd.concat([pd.Series([base], index=[daily.index[0] - pd.Timedelta(days=1)]), daily])
    r = daily.pct_change().dropna()
    rf = (1 + bt.savings_apy) ** (1 / 365) - 1
    sd = r.std()
    sharpe = (r.mean() - rf) / sd * math.sqrt(365) if sd > 1e-12 else float("nan")
    fl = _window(res.flows, start, end)
    ev = res.events
    if len(ev):
        ev = ev[(ev["time"] >= eq.index[0]) & (ev["time"] <= eq.index[-1])]
    dep = _window(res.deployed, start, end)
    return {
        "CAGR": cagr, "Total return": total, "Max drawdown": dd, "Sharpe": sharpe,
        "Volatility": sd * math.sqrt(365) if sd == sd else float("nan"),
        "Funding earned": fl["funding"].sum(), "Fees + slippage": fl["costs"].sum(),
        "Liquidations": int((ev["cause"] == "liquidation").sum()) if len(ev) else 0,
        "Stops": int((ev["cause"] == "stop").sum()) if len(ev) else 0,
        "Time deployed": float((dep > 0.01).mean()), "Avg exposure": float(dep.mean()),
        "Final equity": float(eq.iloc[-1]),
    }


def savings_metrics(index, bt: BacktestConfig, start=None, end=None) -> dict:
    s = _window(savings_curve(index, bt), start, end)
    i0 = index.get_loc(s.index[0])
    base = bt.initial_capital * (1 + bt.savings_apy) ** ((i0 - 1) / 8760) if i0 else bt.initial_capital
    total = s.iloc[-1] / base - 1
    return {"CAGR": (1 + total) ** (8760 / len(s)) - 1, "Total return": total, "Max drawdown": 0.0,
            "Sharpe": float("nan"), "Volatility": 0.0, "Funding earned": 0.0, "Fees + slippage": 0.0,
            "Liquidations": 0, "Stops": 0, "Time deployed": 0.0, "Avg exposure": 0.0,
            "Final equity": float(s.iloc[-1])}


def summary_table(results, bt) -> pd.DataFrame:
    rows = {r.name: metrics(r, bt) for r in results}
    rows[f"Savings {bt.savings_apy:.1%}"] = savings_metrics(results[0].equity.index, bt)
    return pd.DataFrame(rows).T


def period_table(results, bt) -> pd.DataFrame:
    rows = []
    idx = results[0].equity.index
    periods = {str(y): (f"{y}-01-01", f"{y}-12-31") for y in sorted(set(idx.year))}
    periods.update(PERIODS)
    for label, (a, b) in periods.items():
        for r in results:
            m = metrics(r, bt, a, b)
            if m:
                rows.append({"period": label, "strategy": r.name, **m})
        m = savings_metrics(idx, bt, a, b)
        rows.append({"period": label, "strategy": f"Savings {bt.savings_apy:.1%}", **m})
    return pd.DataFrame(rows)


def worst_events(results, n: int = 10) -> pd.DataFrame:
    """Biggest single losses. Liquidations count what the event itself cost (hedged value just
    before vs cash recovered); other closes count the position's whole PnL."""
    frames = []
    for r in results:
        ev = r.events
        if not len(ev):
            continue
        ev = ev.copy()
        ev["strategy"] = r.name
        ev["loss"] = np.where(ev["cause"] == "liquidation", ev["event_loss"], -ev["pnl"])
        frames.append(ev)
    if not frames:
        return pd.DataFrame()
    ev = pd.concat(frames, ignore_index=True)
    ev = ev[ev["loss"] > 0].sort_values("loss", ascending=False).head(n)
    return ev[["time", "strategy", "coin", "cause", "detail", "loss", "pnl", "funding", "fees",
               "slippage", "price_move", "hours"]].reset_index(drop=True)


# --------------------------------------------------------------------------- outputs
def equity_png(results, bt, path):
    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(12, 8), sharex=True,
                                  gridspec_kw={"height_ratios": [3, 1.2]})
    for i, r in enumerate(results):
        ax.plot(r.equity.index, r.equity.values, lw=1.6, color=COLORS[i % 8], label=r.name)
        dd = r.equity / r.equity.cummax() - 1
        ax2.plot(dd.index, dd.values * 100, lw=1.2, color=COLORS[i % 8])
    sv = savings_curve(results[0].equity.index, bt)
    ax.plot(sv.index, sv.values, lw=1.4, color=SAVINGS_COLOR, label=sv.name)
    ax.set_yscale("log")
    lo = min(r.equity.min() for r in results)
    hi = max(max(r.equity.max() for r in results), sv.max())
    nice = [k * 10 ** e for e in range(3, 8) for k in (1, 1.5, 2, 3, 5, 7)]
    ax.set_yticks([v for v in nice if lo * 0.95 <= v <= hi * 1.05])
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"${v / 1000:,.0f}K"))
    ax.yaxis.set_minor_formatter(matplotlib.ticker.NullFormatter())
    ax.set_ylabel("Equity (USD, log scale)")
    ax.set_title("Delta-neutral funding strategies vs savings")
    ax.legend(frameon=False, loc="lower left")
    ax2.set_ylabel("Drawdown (%)")
    for a in (ax, ax2):
        a.grid(True, color="#e1e0d9", lw=0.6)
        for side in ("top", "right"):
            a.spines[side].set_visible(False)
        a.spines["left"].set_color("#c3c2b7")
        a.spines["bottom"].set_color("#c3c2b7")
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


def _fmt(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    pct = ["CAGR", "Total return", "Max drawdown", "Volatility", "Time deployed", "Avg exposure"]
    usd = ["Funding earned", "Fees + slippage", "Final equity"]
    for c in out.columns:
        if c in pct:
            out[c] = out[c].map(lambda v: "" if v != v else f"{v:.1%}")
        elif c in usd:
            out[c] = out[c].map(lambda v: f"${v:,.0f}")
        elif c == "Sharpe":
            out[c] = out[c].map(lambda v: "-" if v != v else f"{v:.2f}")
    return out


def print_report(results, bt, out_dir):
    summ = summary_table(results, bt)
    per = period_table(results, bt)
    worst = worst_events(results)
    pivot = per.pivot(index="strategy", columns="period", values="Total return")
    pivot = pivot[[c for c in pivot.columns if c not in PERIODS] + list(PERIODS)]
    pivot = pivot.reindex(list(summ.index))

    lines = ["# Funding-rate backtest results", "",
             f"Period: {results[0].equity.index[0]:%Y-%m-%d} to {results[0].equity.index[-1]:%Y-%m-%d}, "
             f"start capital ${bt.initial_capital:,.0f}", "",
             "## Summary", "", _fmt(summ).to_markdown(), "",
             "## Return per period", "", pivot.map(lambda v: f"{v:+.1%}" if v == v else "").to_markdown(), "",
             "## 10 worst events", ""]
    if len(worst):
        w = worst.copy()
        w["time"] = w["time"].dt.strftime("%Y-%m-%d %H:%M")
        for c in ["loss", "pnl", "funding", "fees", "slippage"]:
            w[c] = w[c].map(lambda v: f"${v:,.0f}")
        w["price_move"] = w["price_move"].map(lambda v: f"{v:+.1%}")
        lines.append(w.to_markdown(index=False))
    lines += ["", "## Notes", "", SURVIVORSHIP_NOTE, ""]
    text = "\n".join(lines)
    print(text)
    (out_dir / "summary.md").write_text(text)
    summ.to_csv(out_dir / "summary.csv")
    per.to_csv(out_dir / "periods.csv", index=False)
    worst.to_csv(out_dir / "worst_events.csv", index=False)
    return summ, per, worst


def _clean(v):
    if isinstance(v, (float, np.floating)):
        return None if (v != v or math.isinf(v)) else round(float(v), 6)
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, pd.Timestamp):
        return v.strftime("%Y-%m-%d %H:%M")
    return v


def _records(df: pd.DataFrame) -> list[dict]:
    return [{k: _clean(v) for k, v in row.items()} for row in df.to_dict("records")]


def write_dashboard_data(results, bt, panel, summ, per, worst, grid: pd.DataFrame | None, docs_dir,
                         optimizer: pd.DataFrame | None = None):
    """Write docs/data.js (loaded by docs/index.html). Daily equity keeps the file small."""
    daily = pd.DataFrame({r.name: r.equity.resample("1D").last() for r in results})
    sv = savings_curve(results[0].equity.index, bt).resample("1D").last()
    daily[sv.name] = sv
    events = []
    for r in results:
        if len(r.events):
            e = r.events.copy()
            e["strategy"] = r.name
            e["loss"] = np.where(e["cause"] == "liquidation", e["event_loss"], -e["pnl"])
            events.append(e)
    ev = pd.concat(events, ignore_index=True) if events else pd.DataFrame()
    if len(ev):
        ev = ev.drop(columns=["event_loss"]).sort_values("time")
    universe_counts = {m: len(cs) for m, cs in panel.universe.items()}
    data = {
        "generated": pd.Timestamp.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "start": f"{results[0].equity.index[0]:%Y-%m-%d}",
        "end": f"{results[0].equity.index[-1]:%Y-%m-%d}",
        "initial_capital": bt.initial_capital,
        "savings_name": sv.name,
        "strategies": [r.name for r in results],
        "params": {r.name: {k: _clean(v) for k, v in r.params.items()} for r in results},
        "equity": {"dates": [d.strftime("%Y-%m-%d") for d in daily.index],
                   "series": {c: [_clean(v) for v in daily[c]] for c in daily.columns}},
        "summary": [{"strategy": k, **{c: _clean(v) for c, v in row.items()}}
                    for k, row in summ.iterrows()],
        "periods": _records(per),
        "worst": _records(worst) if len(worst) else [],
        "events": _records(ev) if len(ev) else [],
        "grid": _records(grid) if grid is not None and len(grid) else [],
        "optimizer": _records(optimizer) if optimizer is not None and len(optimizer) else [],
        "universe_coins": len(panel.coins),
        "universe_months": universe_counts,
        "notes": [SURVIVORSHIP_NOTE],
    }
    docs_dir.mkdir(parents=True, exist_ok=True)
    (docs_dir / "data.js").write_text("window.BACKTEST = " + json.dumps(data, separators=(",", ":")) + ";\n")
