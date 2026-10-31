# Funding-rate backtest results

Period: 2021-01-01 to 2026-09-30, start capital $100,000

## Summary

|                            | CAGR   | Total return   | Max drawdown   | Sharpe   | Volatility   | Funding earned   | Fees + slippage   |   Liquidations |   Stops | Time deployed   | Avg exposure   | Final equity   |
|:---------------------------|:-------|:---------------|:---------------|:---------|:-------------|:-----------------|:------------------|---------------:|--------:|:----------------|:---------------|:---------------|
| Passive BTC                | 6.1%   | 40.5%          | -1.2%          | 4.61     | 0.7%         | $45,619          | $5,018            |              0 |       0 | 100.0%          | 99.6%          | $140,480       |
| Threshold BTC              | 6.0%   | 39.4%          | -1.2%          | 4.65     | 0.7%         | $29,422          | $3,993            |              0 |       0 | 24.9%           | 24.8%          | $139,430       |
| Rotation top5              | -31.2% | -88.3%         | -89.9%         | -11.38   | 3.5%         | $48,737          | $134,228          |              3 |       0 | 99.6%           | 96.0%          | $11,685        |
| Passive BTC (no rebalance) | 6.7%   | 44.8%          | -1.7%          | 4.34     | 0.9%         | $43,113          | $735              |              2 |       0 | 100.0%          | 99.6%          | $144,839       |
| Savings 2.5%               | 2.5%   | 15.3%          | 0.0%           | -        | 0.0%         | $0               | $0                |              0 |       0 | 0.0%            | 0.0%           | $115,257       |

## Return per period

| strategy                   | 2021   | 2022   | 2023   | 2024   | 2025   | 2026   | 2021 bull   | 2022 bear   | 2023-26   |
|:---------------------------|:-------|:-------|:-------|:-------|:-------|:-------|:------------|:------------|:----------|
| Passive BTC                | +19.2% | +1.8%  | +4.5%  | +6.4%  | +3.0%  | +1.1%  | +19.2%      | +1.8%       | +15.8%    |
| Threshold BTC              | +18.8% | +2.4%  | +3.4%  | +6.2%  | +2.5%  | +1.9%  | +18.8%      | +2.4%       | +14.6%    |
| Rotation top5              | -13.6% | -34.5% | -31.4% | -29.8% | -39.9% | -28.7% | -13.6%      | -34.5%      | -79.4%    |
| Passive BTC (no rebalance) | +22.8% | +1.3%  | +2.4%  | +7.9%  | +4.6%  | +0.8%  | +22.8%      | +1.3%       | +16.5%    |
| Savings 2.5%               | +2.5%  | +2.5%  | +2.5%  | +2.5%  | +2.5%  | +1.9%  | +2.5%       | +2.5%       | +9.7%     |

## 10 worst events

| time             | strategy      | coin   | cause         | detail                                                  | loss   | pnl     | funding   | fees   | slippage   | price_move   |   hours |
|:-----------------|:--------------|:-------|:--------------|:--------------------------------------------------------|:-------|:--------|:----------|:-------|:-----------|:-------------|--------:|
| 2021-05-19 14:00 | Rotation top5 | SUSHI  | liquidation   | short liquidated (high >= 12.0663), spot sold unhedged  | $4,731 | $-963   | $4        | $58    | $18        | -30.1%       |      13 |
| 2022-07-13 23:00 | Rotation top5 | FLM    | liquidation   | short liquidated (high >= 0.198114), spot sold unhedged | $2,080 | $-2,080 | $7        | $25    | $13        | +42.5%       |     118 |
| 2021-05-20 01:00 | Rotation top5 | DENT   | strategy exit | basis / price gap                                       | $1,501 | $-1,501 | $-113     | $102   | $49        | -44.0%       |      24 |
| 2025-05-02 01:00 | Rotation top5 | ALPACA | strategy exit | basis / price gap                                       | $1,023 | $-1,023 | $1        | $7     | $202       | +0.0%        |      24 |
| 2025-04-23 17:00 | Rotation top5 | TRUMP  | liquidation   | short liquidated (high >= 15.2092), spot sold unhedged  | $800   | $-800   | $1        | $8     | $2         | +39.1%       |      16 |
| 2026-04-23 01:00 | Rotation top5 | DEGO   | strategy exit | basis / price gap                                       | $425   | $-425   | $25       | $6     | $81        | -28.0%       |     120 |
| 2021-09-08 01:00 | Rotation top5 | LUNA   | strategy exit | basis / price gap                                       | $353   | $-353   | $-23      | $63    | $23        | -12.4%       |      24 |
| 2024-09-06 01:00 | Rotation top5 | MATIC  | strategy exit | trading costs                                           | $319   | $-319   | $27       | $11    | $180       | -6.0%        |      72 |
| 2021-05-20 01:00 | Rotation top5 | VET    | strategy exit | trading costs                                           | $304   | $-304   | $-95      | $83    | $33        | -40.6%       |      24 |
| 2021-09-08 01:00 | Rotation top5 | AVAX   | strategy exit | basis / price gap                                       | $264   | $-264   | $-4       | $62    | $23        | -21.2%       |      48 |

## Notes

Survivorship bias: the universe is rebuilt each month from the previous month's top perps by volume and includes coins later delisted (LUNA, FTT, SRM, ...) because the Binance archive keeps them. Remaining bias: only Binance is modeled (an exchange that survived, unlike FTX), perps without a Binance spot pair are excluded, and exchange/counterparty risk is not modeled.
