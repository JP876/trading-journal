import { subDays } from 'date-fns';

import type { Trade } from '../../../types/trade';
import type { TPerformanceReturn } from './types';

export const getPerformance = (trades: Trade[], accountSize: number) => {
  let startBalance = accountSize;
  let firstTradeIndex = trades.findIndex((t) => t.closeDate);

  let finalData: TPerformanceReturn[] = [];
  finalData.push({
    pl: accountSize,
    plPercentage: 0,
    endDate: subDays(new Date(trades[firstTradeIndex].closeDate!), 1),
  });

  for (let i = firstTradeIndex; i < trades.length; i++) {
    let trade = trades[i];
    if (!trade?.profit || !trade?.closeDate) {
      continue;
    }

    let nextPl = startBalance + trade.profit;
    let plPercentage = nextPl / accountSize - 1;

    finalData.push({
      pl: nextPl,
      plPercentage: +plPercentage.toFixed(4),
      endDate: new Date(trade.closeDate),
    });
    startBalance = nextPl;
  }

  return finalData;
};
