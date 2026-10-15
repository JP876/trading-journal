import { differenceInSeconds } from 'date-fns';

import { db } from '../..';
import type { ProfitabilityAnalysis, TradeWithDuration } from './types';
import { decreasingLinearRange } from '../../../utils';
import { findMainTradingSession } from '../tradingSessions';

type TAnalyzeTradeDurationsOptions = {
  maxIntervals?: number;
  maxCount?: number;
};

const analyzeTradeDurations = (trades: TradeWithDuration[], options?: TAnalyzeTradeDurationsOptions) => {
  let tradesWithDuration = trades.map((trade) => {
    const duration = differenceInSeconds(trade.closeDate, trade.openDate);
    return { trade, duration };
  });

  const shortest = tradesWithDuration.reduce((acc, trade) => {
    return acc.duration > trade.duration && trade.duration ? trade : acc;
  }, tradesWithDuration[0]);

  const longest = tradesWithDuration.reduce((acc, trade) => {
    return acc.duration < trade.duration && trade.duration ? trade : acc;
  }, tradesWithDuration[0]);

  // Group trades by intervals. If count is more than 10, group them again with decreased intervals
  // Intervals are in seconds, start from longest trade and end with shortest or 1min
  let finalData: ProfitabilityAnalysis = {};

  const groupTradesByInterval = (intervals: number[], numOfCalls: number = 1) => {
    if (!intervals.length || intervals.length < 2) return;

    const grouped = tradesWithDuration.reduce((acc, trade) => {
      let group = 0;

      for (let i = 0; i < intervals.length; i++) {
        let interval = intervals[i];
        if (!intervals[i + 1]) break;
        if (trade.duration < interval && trade.duration >= intervals[i + 1]) {
          group = interval;
          break;
        }
      }

      if (!group) return acc;

      return {
        ...acc,
        [group]: {
          count: (acc?.[group]?.count ?? 0) + 1,
          trades: [
            ...(acc?.[group]?.trades || []),
            { duration: trade.duration, id: trade.trade.id, result: trade.trade.result },
          ],
        },
      };
    }, {} as ProfitabilityAnalysis);

    if (intervals.length === 2 || !options?.maxCount) {
      finalData = { ...finalData, ...grouped };
      return;
    }

    const maxCount = Math.floor(Math.max(10, options?.maxCount || trades.length * 0.05));

    for (const key in grouped) {
      const value = grouped[key];

      const index = intervals.findIndex((val) => val === +key);
      const min = intervals[index + 1] || 60;

      if (value.count <= maxCount || +key === min) {
        finalData[+key] = value;
        tradesWithDuration = tradesWithDuration.filter((trade) => !value.trades.find((t) => t.id === trade.trade.id));
      } else {
        const nextIntervals = new Set(decreasingLinearRange(+key, min, Math.max(4, 10 - numOfCalls)));
        groupTradesByInterval([...nextIntervals], numOfCalls++);
      }
    }
  };

  // Add 10 to longest duration so that it includes longest trades into finalData
  const interval = new Set(
    decreasingLinearRange(longest.duration + 10, shortest.duration || 60, options?.maxIntervals || 10)
  );
  groupTradesByInterval([...interval]);

  let count = 0;
  let tradeIds = new Set();

  for (const key in finalData) {
    const value = finalData[key];
    if (value.count !== value.trades.length) {
      console.error(`For ${key}, count and trades length is different`);
    }
    count += value.count;
    for (let trade of value.trades) {
      tradeIds.add(trade.id);
    }
  }

  if (count !== tradeIds.size) {
    console.error('Duplicates in final data');
    console.log(tradesWithDuration);
  }

  return finalData;
};

export const getTradeDurations = async (options?: TAnalyzeTradeDurationsOptions): Promise<ProfitabilityAnalysis> => {
  const mainSession = await findMainTradingSession();

  const trades = (await db.trades
    .where({ tradingSession: mainSession.id })
    .filter((t) => !!(t?.openDate && t?.closeDate))
    .toArray()) as TradeWithDuration[];

  const durations = analyzeTradeDurations(trades, options);
  return durations;
};
