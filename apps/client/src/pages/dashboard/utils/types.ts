import type { Result } from '../../../types/trade';

export type TStreakMap = { [key: string]: number };
export type TStreakResult = { [R in Result]: TStreakMap };

export type TTradeDurationsOptions = {
  maxIntervals?: number;
  shortestDuration?: number;
  longestDuration?: number;
};

export type TGroupTradesByDurationOptions = {
  mutate?: boolean;
};

export type TDurationAnalysisValue = {
  count: number;
  trades: {
    id: number;
    duration: number;
    result: Result;
    takeProfit: number | null;
    stopLoss: number | null;
  }[];
};

export type TDurationAnalysis = {
  [key: string]: TDurationAnalysisValue;
};
