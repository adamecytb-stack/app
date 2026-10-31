"""Download Binance public data (data.binance.vision) and build an hourly panel.

No API keys, no rate limits. Everything is cached under cache/ as parquet:

    cache/meta/        symbol lists and monthly volumes (used to pick the universe)
    cache/raw/<kind>/  one parquet per symbol: perp_1h, spot_1h, funding
    cache/panel/       the final hourly panel (wide tables: hours x coins)

Why the archive instead of the REST API / ccxt: the archive is the same Binance data,
it also contains delisted coins (LUNA, FTT, ...), and it isn't geo-blocked.
"""
from __future__ import annotations

import io
import json
import re
import threading
import time
import zipfile
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict, dataclass

import numpy as np
import pandas as pd
import requests

from config import DataConfig

ARCHIVE = "https://data.binance.vision/data"
LISTING = "https://s3-ap-northeast-1.amazonaws.com/data.binance.vision"

KLINE_COLS = ["open_time", "open", "high", "low", "close", "volume", "close_time",
              "quote_volume", "count", "taker_buy_volume", "taker_buy_quote_volume", "ignore"]

# Perp tickers like 1000PEPEUSDT are quoted per 1000 tokens; spot is PEPEUSDT.
MULTIPLIER_PREFIXES = [("1000000", 1e6), ("100000", 1e5), ("10000", 1e4), ("1000", 1e3), ("1M", 1e6)]

_local = threading.local()


# --------------------------------------------------------------------------- HTTP helpers
def _session() -> requests.Session:
    if not hasattr(_local, "s"):
        _local.s = requests.Session()
    return _local.s


def _get(url: str, retries: int = 4) -> bytes | None:
    """GET a URL. Returns None on 404 (file doesn't exist), raises after repeated errors."""
    for attempt in range(retries):
        try:
            r = _session().get(url, timeout=30)
            if r.status_code == 404:
                return None
            r.raise_for_status()
            return r.content
        except requests.RequestException:
            if attempt == retries - 1:
                raise
            time.sleep(2 ** attempt)
    return None


def _list(prefix: str, delimiter: bool = True) -> tuple[list[str], list[str]]:
    """List an S3 'folder' of the archive. Returns (sub-folders, file keys)."""
    folders, keys, marker = [], [], ""
    while True:
        params = {"prefix": prefix, "marker": marker}
        if delimiter:
            params["delimiter"] = "/"
        r = _session().get(LISTING, params=params, timeout=30)
        r.raise_for_status()
        xml = r.text
        folders += re.findall(r"<CommonPrefixes><Prefix>([^<]+)</Prefix>", xml)
        keys += re.findall(r"<Key>([^<]+)</Key>", xml)
        if "<IsTruncated>true</IsTruncated>" not in xml:
            return folders, keys
        nxt = re.search(r"<NextMarker>([^<]+)</NextMarker>", xml)
        marker = nxt.group(1) if nxt else max(folders[-1:] + keys[-1:])


def _read_zip_csv(blob: bytes, columns: list[str] | None) -> pd.DataFrame:
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        raw = z.read(z.namelist()[0]).decode()
    first = raw.split("\n", 1)[0]
    has_header = not first[:1].isdigit() and not first.startswith("-")
    df = pd.read_csv(io.StringIO(raw), header=0 if has_header else None)
    if columns is not None:
        df = df.iloc[:, :len(columns)]
        df.columns = columns
    return df


def _parallel(fn, items, threads: int, label: str):
    out, n, t0 = [], len(items), time.time()
    with ThreadPoolExecutor(threads) as ex:
        for i, res in enumerate(ex.map(fn, items), 1):
            out.append(res)
            if i % 500 == 0 or i == n:
                print(f"  {label}: {i}/{n} ({time.time() - t0:.0f}s)", flush=True)
    return out


def _months(start: str, end: str) -> list[str]:
    return [p.strftime("%Y-%m") for p in pd.period_range(start, end, freq="M")]


# --------------------------------------------------------------------------- symbols & universe
def _cached_json(path, builder):
    if path.exists():
        return json.loads(path.read_text())
    data = builder()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))
    return data


def last_full_month(cfg: DataConfig) -> str:
    """Latest month for which the archive has BTC funding (funding is only published monthly)."""
    def build():
        _, keys = _list("data/futures/um/monthly/fundingRate/BTCUSDT/")
        months = sorted(re.findall(r"(\d{4}-\d{2})\.zip$", k)[0] for k in keys if k.endswith(".zip"))
        return {"month": months[-1], "checked": pd.Timestamp.utcnow().strftime("%Y-%m-%d")}
    path = cfg.cache_dir / "meta" / "last_month.json"
    info = _cached_json(path, build)
    if info["checked"] != pd.Timestamp.utcnow().strftime("%Y-%m-%d"):   # re-check once a day
        path.unlink()
        info = _cached_json(path, build)
    return info["month"]


def coin_map(cfg: DataConfig) -> dict[str, dict]:
    """coin -> {perp, spot, mult}. Only USDT perps that also have a USDT spot pair."""
    def build():
        print("Listing perp and spot symbols in the archive...")
        perp_f, _ = _list("data/futures/um/monthly/klines/")
        spot_f, _ = _list("data/spot/monthly/klines/")
        perps = sorted({f.rstrip("/").split("/")[-1] for f in perp_f})
        spots = {f.rstrip("/").split("/")[-1] for f in spot_f}
        out = {}
        for p in perps:
            if not p.endswith("USDT") or "_" in p:
                continue
            if p in spots:
                out[p[:-4]] = {"perp": p, "spot": p, "mult": 1.0}
                continue
            for pre, mult in MULTIPLIER_PREFIXES:
                if p.startswith(pre) and p[len(pre):] in spots:
                    out[p[len(pre):-4]] = {"perp": p, "spot": p[len(pre):], "mult": mult}
                    break
        print(f"  {len(out)} USDT perps with a matching spot pair")
        return out
    return _cached_json(cfg.cache_dir / "meta" / "coin_map.json", build)


def monthly_volumes(cfg: DataConfig, coins: dict, end_month: str) -> pd.DataFrame:
    """Monthly perp quote volume per coin (sum of the daily klines in each monthly 1d file).

    Note: the archive's 1mo kline files stop in 2023, so the 1d files are used instead.
    Cached; only new months are fetched.
    """
    path = cfg.cache_dir / "meta" / "monthly_volume_1d.parquet"
    have = pd.read_parquet(path) if path.exists() else pd.DataFrame(columns=["coin", "month", "quote_volume"])
    first = (pd.Period(cfg.start, "M") - 1).strftime("%Y-%m")
    wanted = set(_months(first, end_month))

    # Which files exist? One listing call per coin, skipped for coins already complete up to end_month.
    done = set(zip(have["coin"], have["month"]))
    latest = have.groupby("coin")["month"].max().to_dict() if len(have) else {}
    todo_coins = [c for c in coins if latest.get(c, "") < end_month]

    def list_coin(c):
        _, keys = _list(f"data/futures/um/monthly/klines/{coins[c]['perp']}/1d/")
        ms = re.findall(r"-(\d{4}-\d{2})\.zip$", "\n".join(keys), flags=re.M)
        return [(c, m) for m in ms if m in wanted and (c, m) not in done]

    print(f"Checking monthly volume files for {len(todo_coins)} coins...")
    jobs = [j for js in _parallel(list_coin, todo_coins, cfg.download_threads, "listing") for j in js]

    def fetch(job):
        c, m = job
        p = coins[c]["perp"]
        blob = _get(f"{ARCHIVE}/futures/um/monthly/klines/{p}/1d/{p}-1d-{m}.zip")
        if blob is None:
            return None
        df = _read_zip_csv(blob, KLINE_COLS)
        return {"coin": c, "month": m, "quote_volume": float(df["quote_volume"].sum())}

    if jobs:
        print(f"Downloading {len(jobs)} monthly volume files...")
        rows = [r for r in _parallel(fetch, jobs, cfg.download_threads, "volumes") if r]
        have = pd.concat([have, pd.DataFrame(rows)], ignore_index=True)
        have = have.drop_duplicates(["coin", "month"], keep="last")
        path.parent.mkdir(parents=True, exist_ok=True)
        have.to_parquet(path, index=False)
    return have


def build_universe(cfg: DataConfig, vols: pd.DataFrame, end_month: str) -> dict[str, list[str]]:
    """Point-in-time universe: for month m, the top-N coins by perp volume in month m-1.

    Uses only the previous month's volume, so there is no lookahead. Coins that were later
    delisted are included as long as they are in the archive.
    """
    universe = {}
    for m in _months(cfg.start, end_month):
        prev = (pd.Period(m, "M") - 1).strftime("%Y-%m")
        v = vols[vols["month"] == prev].sort_values("quote_volume", ascending=False)
        top = list(v["coin"].head(cfg.universe_size))
        if len(top) < cfg.universe_size:
            print(f"  WARNING: only {len(top)} coins with volume data for {prev} (universe {m})")
        universe[m] = list(dict.fromkeys(list(cfg.always_include) + top))
    return universe


# --------------------------------------------------------------------------- hourly raw data
RAW_KINDS = {
    "perp_1h": ("futures/um/monthly/klines/{s}/1h/{s}-1h-{m}.zip", KLINE_COLS),
    "spot_1h": ("spot/monthly/klines/{s}/1h/{s}-1h-{m}.zip", KLINE_COLS),
    "funding": ("futures/um/monthly/fundingRate/{s}/{s}-fundingRate-{m}.zip", None),
}


def _fetch_raw(kind: str, symbol: str, month: str) -> pd.DataFrame | None:
    tmpl, cols = RAW_KINDS[kind]
    blob = _get(f"{ARCHIVE}/{tmpl.format(s=symbol, m=month)}")
    if blob is None:
        return None
    df = _read_zip_csv(blob, cols)
    if kind == "funding":
        df = df.rename(columns={"calc_time": "time", "last_funding_rate": "rate",
                                "funding_interval_hours": "interval_h"})
        df["time"] = pd.to_datetime(df["time"].astype("int64"), unit="ms", utc=True)
        return df[["time", "interval_h", "rate"]]
    t = df["open_time"].astype("int64")
    t = np.where(t > 10**14, t // 1000, t)            # spot files switched to microseconds in 2025
    out = pd.DataFrame({"time": pd.to_datetime(t, unit="ms", utc=True)})
    for c in ["open", "high", "low", "close", "quote_volume"]:
        out[c] = df[c].astype(float).values
    return out


def load_raw(cfg: DataConfig, kind: str, symbol: str, months: list[str]) -> pd.DataFrame:
    """Load cached data for a symbol, downloading any months not attempted yet."""
    folder = cfg.cache_dir / "raw" / kind
    pq, meta = folder / f"{symbol}.parquet", folder / f"{symbol}.months.json"
    df = pd.read_parquet(pq) if pq.exists() else None
    tried = set(json.loads(meta.read_text())) if meta.exists() else set()
    todo = [m for m in months if m not in tried]
    if todo:
        new = [d for d in (_fetch_raw(kind, symbol, m) for m in todo) if d is not None]
        if new:
            df = pd.concat(([df] if df is not None else []) + new, ignore_index=True)
            df = df.drop_duplicates("time").sort_values("time").reset_index(drop=True)
            folder.mkdir(parents=True, exist_ok=True)
            df.to_parquet(pq, index=False)
        tried |= set(todo)          # 404s (coin not listed that month) are remembered too
        folder.mkdir(parents=True, exist_ok=True)
        meta.write_text(json.dumps(sorted(tried)))
    return df if df is not None else pd.DataFrame()


# --------------------------------------------------------------------------- panel
@dataclass
class Panel:
    """Wide hourly tables (index = hour open time UTC, columns = coins).

    Prices are per *perp contract unit* (spot is multiplied for 1000x contracts).
    Funding is placed on the hour bar in which it settles.
    """
    perp_open: pd.DataFrame
    perp_high: pd.DataFrame
    perp_close: pd.DataFrame
    spot_open: pd.DataFrame
    spot_close: pd.DataFrame
    perp_qvol: pd.DataFrame
    spot_qvol: pd.DataFrame
    funding_rate: pd.DataFrame     # raw rate at settlement hours, NaN elsewhere
    funding_apr: pd.DataFrame      # rate annualized with that settlement's own interval
    in_universe: pd.DataFrame      # bool: coin is in the point-in-time universe that month
    universe: dict

    FRAMES = ["perp_open", "perp_high", "perp_close", "spot_open", "spot_close", "perp_qvol",
              "spot_qvol", "funding_rate", "funding_apr", "in_universe"]

    @property
    def coins(self) -> list[str]:
        return list(self.perp_close.columns)

    @property
    def index(self) -> pd.DatetimeIndex:
        return self.perp_close.index


def _panel_key(cfg: DataConfig, end_month: str) -> str:
    return f"{cfg.start}_{end_month}_top{cfg.universe_size}_{'-'.join(cfg.always_include)}"


def load_panel(cfg: DataConfig | None = None, refresh: bool = False) -> Panel:
    cfg = cfg or DataConfig()
    end_month = last_full_month(cfg) if cfg.end is None else pd.Period(cfg.end, "M").strftime("%Y-%m")
    folder = cfg.cache_dir / "panel" / _panel_key(cfg, end_month)
    if folder.exists() and not refresh:
        frames = {k: pd.read_parquet(folder / f"{k}.parquet") for k in Panel.FRAMES}
        universe = json.loads((folder / "universe.json").read_text())
        return Panel(**frames, universe=universe)

    coins = coin_map(cfg)
    vols = monthly_volumes(cfg, coins, end_month)
    universe = build_universe(cfg, vols, end_month)

    # Months to download per coin: every month it is in the universe, plus one either side
    # (the month before feeds the 24h signal, the month after lets positions be closed).
    all_months = _months((pd.Period(cfg.start, "M") - 1).strftime("%Y-%m"), end_month)
    need: dict[str, set] = {}
    for m, cs in universe.items():
        i = all_months.index(m)
        for c in cs:
            need.setdefault(c, set()).update(all_months[max(i - 1, 0): i + 2])
    print(f"Universe: {len(need)} distinct coins over {len(universe)} months")

    jobs = [(c, kind) for c in sorted(need) for kind in RAW_KINDS]

    def fetch(job):
        c, kind = job
        sym = coins[c]["spot"] if kind == "spot_1h" else coins[c]["perp"]
        return job, load_raw(cfg, kind, sym, sorted(need[c]))

    print(f"Loading hourly data ({len(jobs)} symbol/kind pairs, downloads only what's missing)...")
    raw = dict(_parallel(fetch, jobs, min(cfg.download_threads, 16), "hourly data"))

    idx = pd.date_range(pd.Timestamp(cfg.start, tz="UTC"),
                        pd.Period(end_month, "M").end_time.tz_localize("UTC").floor("h"), freq="h")
    cols = {k: {} for k in Panel.FRAMES}
    for c in sorted(need):
        perp, spot, fund = raw[(c, "perp_1h")], raw[(c, "spot_1h")], raw[(c, "funding")]
        if perp.empty or spot.empty or fund.empty:
            continue
        perp = perp.set_index("time").reindex(idx)
        spot = spot.set_index("time").reindex(idx)
        mult = coins[c]["mult"]
        for k in ["open", "close"]:
            spot[k] = spot[k] * mult
        # Sanity check: spot and perp must be the same asset (catches mis-mapped tickers).
        ratio = (perp["close"] / spot["close"]).dropna()
        if len(ratio) < 24 or not 0.95 < ratio.median() < 1.05:
            print(f"  skipping {c}: spot/perp price mismatch (median ratio {ratio.median():.3f})")
            continue
        fund = fund.copy()
        fund["hour"] = fund["time"].dt.floor("h")
        fund = fund.groupby("hour").agg(rate=("rate", "sum"), interval_h=("interval_h", "last"))
        fund = fund.reindex(idx)
        cols["perp_open"][c], cols["perp_high"][c] = perp["open"], perp["high"]
        cols["perp_close"][c], cols["perp_qvol"][c] = perp["close"], perp["quote_volume"]
        cols["spot_open"][c], cols["spot_close"][c] = spot["open"], spot["close"]
        cols["spot_qvol"][c] = spot["quote_volume"]
        cols["funding_rate"][c] = fund["rate"]
        cols["funding_apr"][c] = fund["rate"] * 8760.0 / fund["interval_h"]
        member = pd.Series(False, index=idx)
        for m, cs in universe.items():
            if c in cs:
                member.loc[m] = True
        cols["in_universe"][c] = member

    frames = {k: pd.DataFrame(v, index=idx) for k, v in cols.items()}
    folder.mkdir(parents=True, exist_ok=True)
    for k, df in frames.items():
        df.to_parquet(folder / f"{k}.parquet")
    (folder / "universe.json").write_text(json.dumps(universe))
    (folder / "config.json").write_text(json.dumps({**asdict(cfg), "cache_dir": str(cfg.cache_dir),
                                                    "end_month": end_month}))
    print(f"Panel: {len(idx)} hours x {frames['perp_close'].shape[1]} coins")
    return Panel(**frames, universe=universe)
