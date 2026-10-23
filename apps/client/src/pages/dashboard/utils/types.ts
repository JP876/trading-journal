import type { Pair } from '../../../types/pair';
import type { Result, Trade } from '../../../types/trade';

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

export type TPairProfitability = {
  pair: Pair;
  trades: Trade[];
  winRate: number;
  winCount: number;
};

export type TStatistic = {
  all: number | null;
  long: number | null;
  short: number | null;
};

export type TStatisticsReturn = {
  daysProcessed: number;
  monthsProcessed: number;
  avgTradesPerDay: number;
  returnPercentage: number;
  avgProft: TStatistic;
  avgLoss: TStatistic;
  tradesCount: TStatistic;
  lossTrades: TStatistic;
  winTrades: TStatistic;
  winRate: TStatistic;
  shortestLostTrades: TStatistic;
  shortestWonTrades: TStatistic;
  longestLostTrades: TStatistic;
  longestWonTrades: TStatistic;
};

export type TStatisticsOptions = {
  fraction?: number;
};

export type TPerformanceReturn = {
  pl: number;
  plPercentage: number;
  endDate: Date;
};

export abstract class Statistic {
  constructor() {}
  abstract update(trade: Trade | null, info?: any): void;
}
