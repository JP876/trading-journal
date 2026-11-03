import { addMilliseconds, addMinutes, clamp, format, subMonths } from 'date-fns';

import { addMultipleTradesDB } from '.';
import { db } from '../..';
import type { Pair } from '../../../../types/pair';
import type { AddRandomTradesFormType, Direction, Result, Trade } from '../../../../types/trade';
import Price from '../../../Price';
import { getRandomFloat, getRandomInt, getRandomItem, shuffleArray } from '../../../utils';
import { findPairById } from '../pairs';
import { getRandomTagIdsDB } from '../tags';

export const ADD_RANDOM_TRADES_OPTIONS: Required<AddRandomTradesFormType> = {
  count: 1_000,
  pairs: [1, 2],
  stopLoss: [5, 20],
  takeProfit: [5, 20],
  tradeDuration: [10, 120],
  positionSize: [10_000, 10_000],
  winPercentage: 50,
  longPercentage: 50,
  startDate: subMonths(new Date(), 6),
  endDate: new Date(),
};

export const addRandomTradesDB = async (options: AddRandomTradesFormType & { tradingSessionId: number }) => {
  const tags = await db.tags.toArray();
  const count = options?.count || ADD_RANDOM_TRADES_OPTIONS.count;

  let startDate = options?.startDate || ADD_RANDOM_TRADES_OPTIONS.startDate;
  let endDate = options?.endDate || ADD_RANDOM_TRADES_OPTIONS.endDate;

  const interval = (endDate.getTime() - startDate.getTime()) / count;

  let pairIds: number[] = Array.from({ length: count }).map(() => {
    if (Array.isArray(options?.pairs) && options.pairs.length) {
      return getRandomItem(options.pairs) || getRandomInt(1, 10);
    }
    return getRandomInt(1, 10);
  });

  let uniquePairIds = [...new Set(pairIds)];
  let pairsInfo: { [key: number]: Pair } = {};
  let getPairsInfo = uniquePairIds.map((id) => findPairById(id));

  for await (const pair of getPairsInfo) {
    pairsInfo[pair.id] = pair;
  }

  const winRate = (options?.winPercentage || ADD_RANDOM_TRADES_OPTIONS.winPercentage) / 100;
  const directionPercentage = (options.longPercentage || ADD_RANDOM_TRADES_OPTIONS.longPercentage) / 100;

  let resultArr: Result[] = shuffleArray([
    ...Array.from({ length: count * winRate }).map(() => 'win' as const),
    ...Array.from({ length: count * (1 - winRate) }).map(() => 'loss' as const),
  ]);
  let directionArr: Direction[] = shuffleArray([
    ...Array.from({ length: count * directionPercentage }).map(() => 'long' as const),
    ...Array.from({ length: count * (1 - directionPercentage) }).map(() => 'short' as const),
  ]);

  let stopLoss = ADD_RANDOM_TRADES_OPTIONS.stopLoss;
  if (Array.isArray(options?.stopLoss) && options?.stopLoss.length === 2) {
    stopLoss = options.stopLoss;
  }

  let takeProfit = ADD_RANDOM_TRADES_OPTIONS.takeProfit;
  if (Array.isArray(options?.takeProfit) && options?.takeProfit.length === 2) {
    takeProfit = options.takeProfit;
  }

  let tradeDuration = ADD_RANDOM_TRADES_OPTIONS.tradeDuration;
  if (Array.isArray(options?.tradeDuration) && options?.tradeDuration.length === 2) {
    tradeDuration = options.tradeDuration;
  }

  let positionSize = ADD_RANDOM_TRADES_OPTIONS.positionSize;
  if (Array.isArray(options?.positionSize) && options?.positionSize.length === 2) {
    positionSize = options.positionSize;
  }

  const trades: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>[] = Array.from({ length: count }).map((_, index) => {
    let openDate = addMilliseconds(startDate, interval * index);
    let closeDate = addMinutes(openDate, getRandomInt(tradeDuration[0], tradeDuration[1]));

    let sl = +getRandomFloat(stopLoss[0], stopLoss[1]).toFixed(2);
    let tp = +getRandomFloat(takeProfit[0], takeProfit[1]).toFixed(2);
    let ps = getRandomInt(positionSize[0], positionSize[1], 1_000);
    let pairId = pairIds[index];
    let result = resultArr[index];

    let pairInfo = pairsInfo[pairId];
    let profit: number | undefined;

    if (pairInfo?.pair) {
      let calculatedProfit = Price.calculateProfit(result === 'win' ? tp : sl, pairInfo.pair, {
        positionSize: ps,
      });
      if (calculatedProfit) {
        profit = result === 'win' ? calculatedProfit : calculatedProfit * -1;
      }
    }

    return {
      tags: tags.length < 2 ? [] : getRandomTagIdsDB(tags),
      tradingSession: options.tradingSessionId,
      pair: pairId,
      result: result,
      direction: directionArr[index],
      stopLoss: sl,
      takeProfit: tp,
      closedBy: 'tp/sl',
      profit,
      positionSize: ps,
      openDate: format(
        clamp(openDate, {
          start: options?.startDate || ADD_RANDOM_TRADES_OPTIONS.startDate,
          end: options?.endDate || ADD_RANDOM_TRADES_OPTIONS.endDate,
        }),
        'yyyy-MM-dd HH:mm'
      ),
      closeDate: format(
        clamp(closeDate, {
          start: options?.startDate || ADD_RANDOM_TRADES_OPTIONS.startDate,
          end: options?.endDate || ADD_RANDOM_TRADES_OPTIONS.endDate,
        }),
        'yyyy-MM-dd HH:mm'
      ),
    };
  });

  return addMultipleTradesDB(trades);
};
