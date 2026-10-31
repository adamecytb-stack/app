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
    # Coins ranked in the top N of a January universe get the whole year downloaded, so a basket
    # that holds them all year doesn't hit a fake "data end" when they drop out of the top 30.
    full_year_top: int = 10


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
    # Liquidation guard: act once the price has covered this fraction of the way from the last
    # (re)balance price to the liquidation price (e.g. 0.7 = 70%). None = off.
    liq_guard: float | None = None
    # What to do then: "topup" = sell some spot and add margin (keep the coin),
    #                  "swap"  = close the coin; the strategy moves the capital to another coin.
    liq_action: str = "topup"
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
    min_apr: float = 0.05                      # enter: only buy coins whose avg funding is above this
    # --- turnover controls (the defaults below = the original naive rotation) ---
    exit_apr: float | None = None              # exit a held coin only below this (None = min_apr)
    hold_rank: int | None = None               # keep a held coin while its rank <= this (None = N)
    min_volume: float = 0.0                    # min trailing 24h USD volume on BOTH legs to enter


@dataclass
class BasketParams:
    top_n: int = 5                             # hold the N biggest coins by volume
    # Pause a coin (its slice sits in savings) when its trailing funding drops below pause_apr,
    # resume when it gets back above resume_apr. pause_apr=None = always invested.
    pause_apr: float | None = None
    resume_apr: float = 0.05
    pause_lookback_hours: int = 168
    ban_hours: int = 720                       # a coin forced out can't come back for 30 days


# Best rotation settings from optimize.py, chosen on 2021-2023 data only (2024+ was not used).
# Re-run `python optimize.py` to re-tune; copy the "Chosen" line here.
OPTIMIZED_ROTATION = RotationParams(top_n=5, rebalance_hours=8, lookback_hours=336, min_apr=0.20,
                                    exit_apr=0.05, hold_rank=10, min_volume=100e6)
OPTIMIZED_ROTATION_LEVERAGE = 3.0

# Best always-invested basket from `python optimize.py --mode basket` (chosen on 2021-2023 only):
# top 3 coins by volume (re-picked each January), 3x short leverage, top up margin once the price
# has covered 85% of the way to liquidation, pause a coin while its 7-day funding is below 0%.
OPTIMIZED_BASKET = BasketParams(top_n=3, pause_apr=0.0, resume_apr=0.05)
OPTIMIZED_BASKET_RISK = RiskConfig(leverage=3.0, rebalance_drift=None, liq_guard=0.85, liq_action="topup")


@dataclass
class GridConfig:
    leverage: list = field(default_factory=lambda: [1.0, 1.5, 2.0, 3.0])
    enter_apr: list = field(default_factory=lambda: [0.05, 0.10, 0.15, 0.20, 0.30])
    exit_apr: list = field(default_factory=lambda: [0.0, 0.02, 0.05, 0.10])
    top_n: list = field(default_factory=lambda: [3, 5, 8])
    rebalance_hours: list = field(default_factory=lambda: [8, 24, 72])
    rank_by: str = "sharpe_is"                 # rank configs by in-sample Sharpe
