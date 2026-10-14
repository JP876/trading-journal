import type { Result, Trade } from '../../../../types/trade';

export type StreakMap = { [key: string]: number };
export type StreakResult = { [R in Result]: StreakMap };

export type TradeWithDuration = Omit<Trade, 'openDate' | 'closeDate'> & { openDate: string; closeDate: string };

export type DurationResult = {
  durationMs: number;
  durationFormatted: string;
  trade: Trade;
};

export type ProfitabilityAnalysis = {
  fastestWin: DurationResult;
  slowestWin: DurationResult;
  fastestLoss: DurationResult;
  slowestLoss: DurationResult;
  avgWinDuration: string;
  avgLossDuration: string;
  totalWins: number;
  totalLosses: number;
  winBuckets: { [key: string]: number };
  lossBuckets: { [key: string]: number };
};
