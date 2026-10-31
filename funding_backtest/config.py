"""All settings for the backtest live here.

Edit the defaults below, or override them from run.py.
"""
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent


@dataclass
class DataConfig:
    start: str = "2021-01-01"
    # None = last full month available in the Binance archive (funding files are monthly).
    end: str | None = None
    universe_size: int = 30                    # top N perps by previous-month volume
    always_include: tuple = ("BTC", "ETH")
    cache_dir: Path = ROOT / "cache"
    download_threads: int = 24


@dataclass
class CostConfig:
    spot_fee: float = 0.0010                   # 0.10% taker, per side
    perp_fee: float = 0.0005                   # 0.05% taker, per side
    # slippage (bps) = base + impact * sqrt(order notional / leg's trailing 24h quote volume)
    slip_base_bps: float = 2.0
    slip_impact_bps: float = 100.0
    slip_cap_bps: float = 500.0                # never assume worse than 5% per fill


@dataclass
class RiskConfig:
    leverage: float = 1.5                      # short leverage; capital split = spot L/(1+L), margin 1/(1+L)
    mmr: float = 0.005                         # maintenance margin rate (isolated)
    # Re-balance a position (sell spot / add margin or vice versa) when the perp price has
    # moved more than this fraction since the last (re)balance. None = never.
    rebalance_drift: float | None = 0.20
    # Optional hard stop: close both legs when price is > this fraction away from entry. None = off.
    stop_move: float | None = None
    # Skip resizing trades smaller than this fraction of equity (avoids fee churn).
    min_trade_frac: float = 0.02


@dataclass
class BacktestConfig:
    initial_capital: float = 100_000.0
    savings_apy: float = 0.025                 # idle cash yield (savings proxy)
    output_dir: Path = ROOT / "output"
    docs_dir: Path = ROOT.parent / "docs"      # GitHub Pages dashboard
    # In-sample / out-of-sample split used by the grid search.
    is_end: str = "2023-12-31"
    oos_start: str = "2024-01-01"


@dataclass
class PassiveParams:
    coin: str = "BTC"


@dataclass
class ThresholdParams:
    coin: str = "BTC"
    enter_apr: float = 0.15                    # X: enter when annualized funding > 15%
    exit_apr: float = 0.05                     # Y: exit when annualized funding < 5%
    signal: str = "avg"                        # "avg" = trailing average, "last" = last settled rate
    lookback_hours: int = 24


@dataclass
class RotationParams:
    top_n: int = 5                             # N
    rebalance_hours: int = 24                  # K
    max_weight: float = 0.20
    lookback_hours: int = 24
    min_apr: float = 0.05                      # only hold coins whose avg funding is above this


@dataclass
class GridConfig:
    leverage: list = field(default_factory=lambda: [1.0, 1.5, 2.0, 3.0])
    enter_apr: list = field(default_factory=lambda: [0.05, 0.10, 0.15, 0.20, 0.30])
    exit_apr: list = field(default_factory=lambda: [0.0, 0.02, 0.05, 0.10])
    top_n: list = field(default_factory=lambda: [3, 5, 8])
    rebalance_hours: list = field(default_factory=lambda: [8, 24, 72])
    rank_by: str = "sharpe_is"                 # rank configs by in-sample Sharpe
