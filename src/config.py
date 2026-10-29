"""Load config.yaml and guard the data splits.

The splits (development / validation / holdout) are fingerprinted with a
SHA-256 hash stored in config.yaml. If anyone edits a split date, the hash
stops matching and load_config() refuses to run. That makes moving the
holdout boundary a loud, deliberate act instead of a silent one (rule 2).
"""

import hashlib
import json
from pathlib import Path

import yaml

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = PROJECT_ROOT / "config.yaml"


def splits_hash(splits: dict) -> str:
    """Return the SHA-256 of the splits section.

    The dict is written as JSON with sorted keys first, so the hash depends
    only on the dates, not on key order or YAML formatting.
    """
    canonical = json.dumps(splits, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def load_config(path: Path = CONFIG_PATH) -> dict:
    """Read config.yaml and check that the splits have not been changed."""
    with open(path, encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    expected = cfg.get("splits_sha256")
    actual = splits_hash(cfg["splits"])
    if expected != actual:
        raise ValueError(
            "config.yaml splits do not match splits_sha256. "
            "A split boundary was changed. Stop and ask the owner before going on.\n"
            f"  stored:   {expected}\n"
            f"  computed: {actual}"
        )
    return cfg
