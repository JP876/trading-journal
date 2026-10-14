import { db } from '../..';
import type { Result } from '../../../../types/trade';

type StreakMap = { [key: string]: number };
export type StreakResult = { [R in Result]: StreakMap };

export const findConsecutiveTrades = async (): Promise<StreakResult> => {
  const trades = await db.trades.toArray();

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
