# Funding-rate backtest results

Period: 2021-01-01 to 2026-09-30, start capital $100,000

## Summary

|                            | CAGR   | Total return   | Max drawdown   | Sharpe   | Volatility   | Funding earned   | Fees + slippage   |   Liquidations |   Stops | Time deployed   | Avg exposure   | Final equity   |
|:---------------------------|:-------|:---------------|:---------------|:---------|:-------------|:-----------------|:------------------|---------------:|--------:|:----------------|:---------------|:---------------|
| Passive BTC                | 6.1%   | 40.5%          | -1.2%          | 4.61     | 0.7%         | $45,619          | $5,018            |              0 |       0 | 100.0%          | 99.6%          | $140,480       |
| Threshold BTC              | 6.0%   | 39.4%          | -1.2%          | 4.65     | 0.7%         | $29,422          | $3,993            |              0 |       0 | 24.9%           | 24.8%          | $139,430       |
| Rotation top5 (naive)      | -31.7% | -88.9%         | -90.4%         | -11.82   | 3.4%         | $48,615          | $135,225          |              3 |       0 | 99.6%           | 96.0%          | $11,149        |
| Passive BTC (no rebalance) | 6.7%   | 44.8%          | -1.7%          | 4.34     | 0.9%         | $43,113          | $735              |              2 |       0 | 100.0%          | 99.6%          | $144,839       |
| Rotation (optimized)       | 8.1%   | 56.2%          | -6.9%          | 1.46     | 3.7%         | $62,930          | $21,697           |             13 |       0 | 31.9%           | 23.3%          | $156,176       |
| Savings 2.5%               | 2.5%   | 15.3%          | 0.0%           | -        | 0.0%         | $0               | $0                |              0 |       0 | 0.0%            | 0.0%           | $115,257       |

## Return per period

| strategy                   | 2021   | 2022   | 2023   | 2024   | 2025   | 2026   | 2021 bull   | 2022 bear   | 2023-26   |
|:---------------------------|:-------|:-------|:-------|:-------|:-------|:-------|:------------|:------------|:----------|
| Passive BTC                | +19.2% | +1.8%  | +4.5%  | +6.4%  | +3.0%  | +1.1%  | +19.2%      | +1.8%       | +15.8%    |
| Threshold BTC              | +18.8% | +2.4%  | +3.4%  | +6.2%  | +2.5%  | +1.9%  | +18.8%      | +2.4%       | +14.6%    |
| Rotation top5 (naive)      | -13.7% | -34.7% | -31.9% | -30.3% | -41.3% | -28.9% | -13.7%      | -34.7%      | -80.2%    |
| Passive BTC (no rebalance) | +22.8% | +1.3%  | +2.4%  | +7.9%  | +4.6%  | +0.8%  | +22.8%      | +1.3%       | +16.5%    |
| Rotation (optimized)       | +26.8% | +2.5%  | +6.0%  | +6.8%  | +4.3%  | +1.9%  | +26.8%      | +2.5%       | +20.2%    |
| Savings 2.5%               | +2.5%  | +2.5%  | +2.5%  | +2.5%  | +2.5%  | +1.9%  | +2.5%       | +2.5%       | +9.7%     |

## 10 worst events

| time             | strategy              | coin   | cause         | detail                                                  | loss   | pnl     | funding   | fees   | slippage   | price_move   |   hours |
|:-----------------|:----------------------|:-------|:--------------|:--------------------------------------------------------|:-------|:--------|:----------|:-------|:-----------|:-------------|--------:|
| 2021-05-19 14:00 | Rotation top5 (naive) | SUSHI  | liquidation   | short liquidated (high >= 12.0663), spot sold unhedged  | $4,730 | $-963   | $4        | $58    | $18        | -30.1%       |      13 |
| 2021-01-30 17:00 | Rotation (optimized)  | XRP    | liquidation   | short liquidated (high >= 0.445054), spot sold unhedged | $2,335 | $-1,756 | $647      | $79    | $28        | +13.1%       |     488 |
| 2025-11-05 18:00 | Rotation (optimized)  | GIGGLE | liquidation   | short liquidated (high >= 218.503), spot sold unhedged  | $2,267 | $-2,341 | $3        | $94    | $34        | +51.6%       |       9 |
| 2021-01-29 05:00 | Rotation (optimized)  | XLM    | liquidation   | short liquidated (high >= 0.376214), spot sold unhedged | $2,014 | $-1,761 | $359      | $78    | $35        | +13.8%       |     284 |
| 2022-07-13 23:00 | Rotation top5 (naive) | FLM    | liquidation   | short liquidated (high >= 0.193435), spot sold unhedged | $1,780 | $-1,780 | $5        | $25    | $12        | +46.0%       |      94 |
| 2025-03-18 02:00 | Rotation (optimized)  | BNX    | data end      | market data ends (delisted / no longer listed)          | $1,762 | $-1,762 | $1,165    | $206   | $109       | +84.9%       |     137 |
| 2021-05-20 01:00 | Rotation top5 (naive) | DENT   | strategy exit | basis / price gap                                       | $1,501 | $-1,501 | $-113     | $102   | $49        | -44.0%       |      24 |
| 2021-01-15 14:00 | Rotation (optimized)  | LINK   | liquidation   | short liquidated (high >= 21.4802), spot sold unhedged  | $1,475 | $-1,156 | $444      | $98    | $38        | +41.6%       |     269 |
| 2025-11-05 07:00 | Rotation (optimized)  | GIGGLE | liquidation   | short liquidated (high >= 132.131), spot sold unhedged  | $1,000 | $-1,034 | $1        | $65    | $21        | +29.3%       |       6 |
| 2025-05-02 01:00 | Rotation top5 (naive) | ALPACA | strategy exit | basis / price gap                                       | $991   | $-991   | $1        | $7     | $196       | +0.0%        |      24 |

## Notes

Survivorship bias: the universe is rebuilt each month from the previous month's top perps by volume and includes coins later delisted (LUNA, FTT, SRM, ...) because the Binance archive keeps them. Remaining bias: only Binance is modeled (an exchange that survived, unlike FTX), perps without a Binance spot pair are excluded, and exchange/counterparty risk is not modeled.
