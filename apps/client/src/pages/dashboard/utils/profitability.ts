import type { Pair } from '../../../types/pair';
import type { Trade } from '../../../types/trade';
import type { TPairProfitability } from './types';

export const getPairsByProfitability = (trades: Trade[], pairs: Pair[]) => {
  const pairIds = [...new Set(trades.map((el) => el.pair))];
  let tradesData = [...trades];
  let finalData: TPairProfitability[] = [];

  for (let i = 0; i < pairIds.length; i++) {
    let pairId = pairIds[i];
    let pairInfo = pairs.find((p) => p.id === pairId);

    if (!pairInfo) {
      continue;
    }

    let pairTrades: Trade[] = [];

    for (let j = 0; j < tradesData.length; j++) {
      let trade = tradesData[j];

      if (trade.pair === pairId) {
        pairTrades.push(trade);
        tradesData.splice(j, 1);
        j--;
      }
    }

    let wonTrades = pairTrades.filter((p) => p.result === 'win');

    finalData.push({
      pair: pairInfo,
      trades: pairTrades,
      winRate: +((wonTrades.length / pairTrades.length) * 100).toFixed(0),
      winCount: wonTrades.length,
    });
  }

  return finalData;
};
