import { differenceInSeconds } from 'date-fns';

import type {
  TTradeDurationsOptions,
  TDurationAnalysis,
  TDurationAnalysisValue,
  TGroupTradesByDurationOptions,
} from './types';
import { decreasingLinearRange } from '../../../lib/utils';
import type { Trade } from '../../../types/trade';

export const groupTradesByDuration = (
  end: number,
  start: number,
  trades: Trade[],
  options?: TGroupTradesByDurationOptions
) => {
  let data = trades;
  let result: TDurationAnalysisValue = { count: 0, trades: [] };

  if (!options?.mutate) data = [...trades];

  for (let i = 0; i < data.length; i++) {
    let trade = data[i];

    if (!trade.closeDate || !trade.openDate) {
      continue;
    }

    let duration = differenceInSeconds(trade.closeDate, trade.openDate);

    if (duration > start && duration <= end) {
      result.count++;
      result.trades = [
        ...result.trades,
        {
          id: trade.id,
          duration,
          result: trade.result,
          takeProfit: trade.takeProfit || null,
          stopLoss: trade.stopLoss || null,
        },
      ];
      data.splice(i, 1);
      i--; // Re-check the new element at this index
    }
  }

  return result;
};

export const getTradeDurationInfo = (trades: Trade[]) => {
  const tradesWithDuration = trades.reduce(
    (acc, trade) => {
      if (!trade?.closeDate || !trade?.openDate) return acc;
      const duration = differenceInSeconds(trade.closeDate, trade.openDate);
      return [...acc, { trade, duration }];
    },
    [] as { duration: number; trade: Trade }[]
  );

  const shortest = tradesWithDuration.reduce((acc, trade) => {
    return acc.duration > trade.duration && trade.duration ? trade : acc;
  }, tradesWithDuration[0]);

  const longest = tradesWithDuration.reduce((acc, trade) => {
    return acc.duration < trade.duration && trade.duration ? trade : acc;
  }, tradesWithDuration[0]);

  return { tradesWithDuration, shortest, longest };
};

export const getTradeDurationAnalysis = (trades: Trade[], options?: TTradeDurationsOptions) => {
  let shortest = options?.shortestDuration;
  let longest = options?.longestDuration;

  if (!shortest || !longest) {
    let info = getTradeDurationInfo(trades);

    shortest = shortest || info.shortest.duration;
    longest = longest || info.longest.duration;
  }

  // Group trades by intervals. If count is more than 10, group them again with decreased intervals
  // Intervals are in seconds, start from longest trade and end with shortest or 1min

  // Add 10 to longest duration so that it includes longest trades into finalData
  const intervals = [...new Set(decreasingLinearRange(longest + 10, shortest || 60, options?.maxIntervals || 10))];

  let finalData: TDurationAnalysis = {};
  let tradesCopy = [...trades];

  for (let i = 0; i < intervals.length; i++) {
    if (!intervals[i + 1]) break;
    const result = groupTradesByDuration(intervals[i], intervals[i + 1], tradesCopy, {
      mutate: true,
    });
    finalData[intervals[i]] = result;
  }

  return finalData;
};
