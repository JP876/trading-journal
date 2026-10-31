import { addMilliseconds, addMinutes, clamp, format, isBefore, subMonths } from 'date-fns';

import { db } from '../..';
import type { PaginationInfo } from '../../../../types';
import type {
  AddRandomTradesFormType,
  TGetTradesOptions,
  Result,
  Trade,
  TradeFormSchemaType,
  TradesCount,
} from '../../../../types/trade';
import { getRandomFloat, getRandomInt, getRandomItem } from '../../../utils';
import handlePagination from '../../pagination';
import { getRandomTagIdsDB } from '../tags';
import { findMainTradingSession } from '../tradingSessions';
import Price from '../../../Price';
import type { Pair } from '../../../../types/pair';
import { findPairById } from '../pairs';
import { getPerformance } from '../../../../pages/dashboard/utils/performance';
import type { TradingSession } from '../../../../types/tradingSessions';

export const getTradesCountPerTradingSessionDB = async (): Promise<TradesCount[]> => {
  const [sessions] = await Promise.all([db.tradingSessions.toArray(), db.trades.toArray()]);
  const result: TradesCount[] = [];

  for await (const session of sessions) {
    const count = await db.trades.filter((t) => t.tradingSession === session.id).count();
    result.push({ tradingSession: session.id, count });
  }

  return result;
};

export const getTradesProfitDB = async (session: TradingSession) => {
  const trades = await db.trades.where({ tradingSession: session.id }).toArray();
  const performance = getPerformance(trades, session.accountSize);

  return {
    count: trades.length,
    profit: performance[performance.length - 1],
  };
};

export const getTradesDB = async (params: TGetTradesOptions): Promise<PaginationInfo<Trade[]>> => {
  const [session] = await Promise.all([findMainTradingSession()]);
  const totalCount = await db.trades.where({ tradingSession: session.id }).count();

  const query = db.trades.where({ tradingSession: session.id }).filter((trade) => {
    const pair = params.pair ? params.pair === trade.pair : true;
    const result = params.result ? params.result === trade.result : true;

    let tags = true;

    if (params.tags) {
      const t = params.tags
        .split(',')
        .filter((t) => !isNaN(+t) && Number.isInteger(+t))
        .map((t) => +t);
      tags = trade.tags.some((tagId) => t.some((tId) => tId === tagId));
    }

    const openDate =
      params?.openDate && trade.openDate
        ? isBefore(new Date(params.openDate), new Date(trade.openDate))
        : params?.openDate
          ? !!trade.openDate
          : true;
    const closeDate =
      params?.closeDate && trade.closeDate
        ? isBefore(new Date(trade.closeDate), new Date(params.closeDate))
        : params?.closeDate
          ? !!trade.closeDate
          : true;

    return pair && result && openDate && closeDate && tags;
  });

  const finalData = await handlePagination(query, params);

  return { ...finalData, totalItemsExcludingFilter: totalCount };
};

export const addTradeDB = async (trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const { tradingSessionId, pairId, ...restTrade } = trade;

  return db.trades.add({
    ...restTrade,
    tags: trade.tags || [],
    tradingSession: tradingSessionId,
    pair: pairId,
    openDate: trade.openDate && format(trade.openDate, 'yyyy-MM-dd HH:mm'),
    closeDate: trade.closeDate && format(trade.closeDate, 'yyyy-MM-dd HH:mm'),
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
  });
};

export const addMultipleTradesDB = async (trades: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>[]) => {
  const lastTrade = await db.trades.orderBy('id').last();
  const data = trades.map((t, index) => ({
    ...t,
    id: index + 1 + (lastTrade?.id ?? 0),
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
  }));

  return db.trades.bulkAdd(data);
};

export const ADD_RANDOM_TRADES_OPTIONS: Required<AddRandomTradesFormType> = {
  count: 100,
  pairs: [],
  stopLoss: [1, 20],
  takeProfit: [1, 20],
  tradeDuration: [1, 60],
  positionSize: [5_000, 10_000],
  winPercentage: 50,
  longPercentage: 50,
  startDate: subMonths(new Date(), 6),
  endDate: new Date(),
};

// Fisher-Yates (Durstenfeld) algorithm
const shuffleArray = <T>(arr: T[]): T[] => {
  let j: number;
  let copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
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
  let pairsInfo: Pair[] = [];
  let getPairsInfo = uniquePairIds.map((id) => findPairById(id));

  for await (const pair of getPairsInfo) {
    pairsInfo.push(pair);
  }

  const winRate = (options?.winPercentage || ADD_RANDOM_TRADES_OPTIONS.winPercentage) / 100;
  const directionPercentage = options.longPercentage || ADD_RANDOM_TRADES_OPTIONS.longPercentage;

  const resultArr: Result[] = shuffleArray([
    ...Array.from({ length: count * winRate }).map(() => 'win' as const),
    ...Array.from({ length: count * (1 - winRate) }).map(() => 'loss' as const),
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
    let ps = getRandomInt(positionSize[0], positionSize[1], 100);

    let pairInfo = pairsInfo.find((p) => p.id === pairIds[index]);
    let profit: number | undefined;

    if (pairInfo?.pair) {
      let calculatedProfit = Price.calculateProfit(resultArr[index] === 'win' ? tp : sl, pairInfo.pair, {
        positionSize: ps,
      });
      if (calculatedProfit) {
        profit = resultArr[index] === 'win' ? calculatedProfit : calculatedProfit * -1;
      }
    }

    return {
      tags: tags.length < 2 ? [] : getRandomTagIdsDB(tags),
      tradingSession: options.tradingSessionId,
      pair: pairIds[index],
      result: resultArr[index],
      direction: Math.random() >= directionPercentage / 100 ? 'long' : 'short',
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

export const editTradeDB = async (id: number, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const { tradingSessionId, pairId, ...restTrade } = trade;

  return db.trades.update(id, {
    ...restTrade,
    tags: trade.tags || [],
    tradingSession: tradingSessionId,
    pair: pairId,
    openDate: trade.openDate && format(trade.openDate, 'yyyy-MM-dd HH:mm'),
    closeDate: trade.closeDate && format(trade.closeDate, 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
  });
};

export const deleteTradeDB = async (id: number) => {
  return db.trades.delete(id);
};
