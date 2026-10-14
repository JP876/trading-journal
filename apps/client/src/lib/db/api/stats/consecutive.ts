import { db } from '../..';
import { findMainTradingSession } from '../tradingSessions';
import type { StreakResult } from './types';

export const getConsecutiveTrades = async (): Promise<StreakResult> => {
  const session = await findMainTradingSession();
  const trades = await db.trades.where({ tradingSession: session.id }).toArray();

  const streaks: StreakResult = { win: {}, loss: {}, be: {} };

  if (trades.length === 0) return streaks;

  let currentResult = trades[0].result;
  let currentCount = 0;

  for (let i = 0; i <= trades.length; i++) {
    const trade = trades[i];

    if (trade && trade.result === currentResult) {
      currentCount++;
    } else {
      const streakType = currentResult;
      const countKey = currentCount.toString();

      streaks[streakType][countKey] = (streaks[streakType][countKey] || 0) + 1;

      if (trade) {
        currentResult = trade.result;
        currentCount = 1;
      }
    }
  }

  return streaks;
};
