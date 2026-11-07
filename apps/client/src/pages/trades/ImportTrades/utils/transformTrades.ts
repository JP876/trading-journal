import { formatToPips } from '../../../../lib/price';
import type { Pair } from '../../../../types/pair';
import type { ClosedBy, Direction, Result, Trade } from '../../../../types/trade';
import type { TradingSession } from '../../../../types/tradingSessions';

const transformTrades = (user: number | string, trades: Trade[], pairs: Pair[], mainSession: TradingSession) => {
  let finalData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>[] = trades.map((t) => {
    let result: Result = 'be';
    let takeProfit = t?.takeProfit;
    let stopLoss = t?.stopLoss;
    let pair = pairs.find((p) => t.pair.toString() === p.pair);

    let direction = t.direction as 'long' | 'short' | 'buy' | 'sell';
    let finalDirection: Direction = direction === 'long' || direction === 'buy' ? 'long' : 'short';
    let closedBy: ClosedBy = 'tp/sl';
    let closedAt = 0;

    if (t?.profit) {
      result = t.profit.toString().includes('-') ? 'loss' : 'win';
    }
    if (t?.entryPrice && t?.closePrice) {
      let priceDiff = t.entryPrice - t.closePrice < 0;
      if (finalDirection === 'long') {
        result = priceDiff ? 'win' : 'loss';
      } else {
        result = priceDiff ? 'loss' : 'win';
      }
    }

    if (t.closePrice && t.entryPrice) {
      if (
        (result === 'loss' && t.stopLossPrice && t.stopLossPrice !== t.closePrice) ||
        (result === 'win' && t.takeProfitPrice && t.takeProfitPrice !== t.takeProfitPrice)
      ) {
        closedBy = 'user';
        closedAt = formatToPips(t.entryPrice, t.closePrice, {
          pair: pair?.pair,
        });
      }
    }

    if (!stopLoss && t.entryPrice && t.stopLossPrice) {
      stopLoss = formatToPips(t.entryPrice, t.stopLossPrice, {
        pair: pair?.pair,
      });
    }
    if (!takeProfit && t.entryPrice && t.takeProfitPrice) {
      takeProfit = formatToPips(t.entryPrice, t.takeProfitPrice, {
        pair: pair?.pair,
      });
    }

    return {
      user: user,
      pair: pair?.id || t.pair,
      takeProfit: takeProfit ?? mainSession?.defaultTakeProfit,
      stopLoss: stopLoss ?? mainSession?.defaultStopLoss,
      result: result,
      tradingSession: mainSession.id,
      tags: [],
      direction: finalDirection,
      positionSize: t.positionSize,
      openDate: t.openDate,
      closeDate: t.closeDate,
      entryPrice: t.entryPrice,
      takeProfitPrice: t.takeProfitPrice,
      stopLossPrice: t.stopLossPrice,
      closePrice: t.closePrice,
      profit: t.profit,
      closedBy: closedBy,
      closedAt: closedAt,
    };
  });

  return finalData;
};

export default transformTrades;
