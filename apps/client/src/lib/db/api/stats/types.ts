import type { Result } from '../../../../types/trade';

export type StreakMap = { [key: string]: number };
export type StreakResult = { [R in Result]: StreakMap };

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
