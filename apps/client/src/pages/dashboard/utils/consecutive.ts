import type { Trade } from '../../../types/trade';
import type { TStreakResult } from './types';

const INITIAL_STREAKS: TStreakResult = { win: {}, loss: {}, be: {} };

export const getConsecutiveTrades = (trades: Trade[]): TStreakResult => {
  if (trades.length === 0) return INITIAL_STREAKS;

  let streaks = INITIAL_STREAKS;
  let currentResult = trades[0].result;
  let currentCount = 1;
  let trade;

  for (let i = 1; i < trades.length; i++) {
    trade = trades[i];

    if (trade.result === currentResult) {
      currentCount++;
      continue;
    }

    if (currentCount > 1) {
      streaks[currentResult][currentCount] = (streaks[currentResult][currentCount] ?? 0) + 1;
    }

    currentCount = 1;
    currentResult = trade.result;
  }

  if (currentCount > 1) {
    streaks[currentResult][currentCount] = (streaks[currentResult][currentCount] ?? 0) + 1;
  }

  return streaks;
};
