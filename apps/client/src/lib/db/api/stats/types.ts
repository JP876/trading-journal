import type { Result, Trade } from '../../../../types/trade';

export type StreakMap = { [key: string]: number };
export type StreakResult = { [R in Result]: StreakMap };

export type TradeWithDuration = Omit<Trade, 'openDate' | 'closeDate'> & { openDate: string; closeDate: string };

export type ProfitabilityAnalysis = {
  [key: string]: {
    count: number;
    trades: { id: number; duration: number; result: Result }[];
  };
};
