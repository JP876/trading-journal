import { differenceInDays, differenceInMonths } from 'date-fns';

import type { Trade } from '../../../../types/trade';
import type { TStatistic, TStatisticsOptions, TStatisticsReturn } from '../types';
import DurationStatistics from './Duration';
import CountTradesStatistic from './CountTrades';
import PerformanceStatistic from './Performance';

const DEFAULT_OPTIONS: TStatisticsOptions = {
  fraction: 2,
};

const getWinRate = (first: number | null, second: number | null, fraction?: number) => {
  if (!first || !second) return null;
  return +(first / second).toFixed(fraction || DEFAULT_OPTIONS.fraction);
};

export const getStatistics = (trades: Trade[], accountSize: number): TStatisticsReturn => {
  let firstOpenDateIndex = trades.findIndex((el) => el.openDate);
  let lastCloseDateIndex = trades.reverse().findIndex((el) => el.closeDate);

  let firstTrade = trades[firstOpenDateIndex];
  let lastTrade = trades.reverse()[lastCloseDateIndex];

  let trade: Trade;

  let duration = new DurationStatistics();
  let count = new CountTradesStatistic();
  let perf = new PerformanceStatistic(accountSize);

  let daysProcessed = differenceInDays(firstTrade.openDate!, lastTrade.closeDate!);

  for (let i = 0; i < trades.length; i++) {
    trade = trades[i];
    count.update(trade);
    duration.update(trade);
    perf.update(trade, count);
  }

  count.update(null);
  perf.update(null, count);
  duration.update(null);

  let winRate: TStatistic = {
    all: getWinRate(count.win.all, count.trades.all),
    long: getWinRate(count.win.long, count.trades.long),
    short: getWinRate(count.win.short, count.trades.short),
  };

  return {
    daysProcessed,
    monthsProcessed: differenceInMonths(firstTrade.openDate!, lastTrade.closeDate!),
    avgTradesPerDay: Math.round(trades.length / daysProcessed),
    returnPercentage: perf.returnPercentage,
    avgProft: perf.avgProft,
    avgLoss: perf.avgLoss,
    tradesCount: count.trades,
    lossTrades: count.loss,
    winTrades: count.win,
    winRate,
    shortestLostTrades: duration.shortestLost,
    shortestWonTrades: duration.shortestWon,
    longestLostTrades: duration.longestLost,
    longestWonTrades: duration.longestWon,
  };
};
