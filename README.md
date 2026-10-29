# Quant Lab

A research pipeline that tests, with statistics, whether any crypto trading rule has a real edge after costs, then paper-trades the survivors forward on MEXC. It is built to kill bad ideas cheaply. It is not a bot that promises profit.

- Spec: [`QUANT_LAB_SPEC.md`](QUANT_LAB_SPEC.md)
- Standing rules: [`CLAUDE.md`](CLAUDE.md)
- All settings: [`config.yaml`](config.yaml)
- What was tried and why it died: [`RESEARCH_LOG.md`](RESEARCH_LOG.md)

No real money, ever. Paper trading uses public market data only.

## Setup (Windows, VS Code)

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m pytest
```

On macOS/Linux, activate with `source .venv/bin/activate` instead.
