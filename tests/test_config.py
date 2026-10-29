"""Guards on config.yaml: sealed splits and cost floors (rules 2 and 4)."""

import shutil

import pytest
import yaml

from src.config import CONFIG_PATH, load_config


def test_config_loads_and_splits_hash_matches():
    cfg = load_config()
    assert cfg["splits_sha256"]


def test_splits_are_back_to_back_with_no_gaps_or_overlap():
    splits = load_config()["splits"]
    assert splits["development"]["end"] == splits["validation"]["start"]
    assert splits["validation"]["end"] == splits["holdout"]["start"]


def test_holdout_boundary_is_the_spec_date():
    holdout = load_config()["splits"]["holdout"]
    assert holdout["start"] == "2025-10-01"
    assert holdout["end"] is None  # runs to the latest data


def test_editing_a_split_date_is_rejected(tmp_path):
    # Copy the config, move the holdout boundary by one month, and check that
    # load_config notices.
    tampered = tmp_path / "config.yaml"
    shutil.copy(CONFIG_PATH, tampered)
    cfg = yaml.safe_load(tampered.read_text(encoding="utf-8"))
    cfg["splits"]["holdout"]["start"] = "2025-11-01"
    tampered.write_text(yaml.safe_dump(cfg), encoding="utf-8")

    with pytest.raises(ValueError, match="splits_sha256"):
        load_config(tampered)


def test_costs_are_not_below_the_spec_defaults():
    # Spec 6.1 stress defaults are the floor. Rule 4 says costs only get stricter.
    costs = load_config()["costs"]
    assert costs["fees_stress_default"]["spot_taker"] >= 0.0010
    assert costs["fees_stress_default"]["perp_taker"] >= 0.0005
    assert costs["slippage_bps"]["tier1"] >= 2
    assert costs["slippage_bps"]["tier2"] >= 5
    assert costs["slippage_bps"]["tier3"] >= 10
    assert max(costs["fee_multipliers"]) >= 3
    assert max(costs["slippage_multipliers"]) >= 2
