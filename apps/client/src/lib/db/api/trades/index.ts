import { addMinutes, format, isBefore, subDays, subHours } from 'date-fns';

import { db } from '../..';
import type {
  AddMultipleRandomTradesFormType,
  GetTradesOptions,
  Trade,
  TradeFormSchemaType,
  TradesCount,
} from '../../../../types/trade';
import type { PaginationInfo } from '../../../../types';
import { findMainTradingSession } from '../tradingSessions';
import handlePagination from '../../pagination';
import { getRandomFloat, getRandomInt, getRandomItem } from '../../../utils';
import { getRandomTagIdsDB } from '../tags';

export const getTradesCountPerTradingSessionDB = async (): Promise<TradesCount[]> => {
  const [sessions] = await Promise.all([db.tradingSessions.toArray(), db.trades.toArray()]);
  const result: TradesCount[] = [];

  for await (const session of sessions) {
    const count = await db.trades.filter((t) => t.tradingSession === session.id).count();
    result.push({ tradingSession: session.id, count });
  }

  return result;
};

export const getTradesDB = async (params: GetTradesOptions): Promise<PaginationInfo<Trade[]>> => {
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

export const addMultipleRandomTradesDB = async (
  options: AddMultipleRandomTradesFormType & { tradingSessionId: number }
) => {
  const lastTrade = await db.trades.orderBy('id').last();
  const tags = await db.tags.toArray();

  const trades: Trade[] = Array.from({ length: options?.count || 100 }).map((_, index) => {
    const openDate = subDays(subHours(new Date(), getRandomInt(2, 10)), getRandomInt(0, 20));
    const closeDate = addMinutes(openDate, getRandomInt(10, 1_000));

    const pair =
      Array.isArray(options?.pairs) && options.pairs.length
        ? getRandomItem(options.pairs) || getRandomInt(1, 10)
        : getRandomInt(1, 10);

    return {
      id: index + 1 + (lastTrade?.id ?? 0),
      tags: tags.length < 2 ? [] : getRandomTagIdsDB(tags),
      tradingSession: options.tradingSessionId,
      pair: pair,
      result: Math.random() >= 0.5 ? 'win' : 'loss',
      direction: Math.random() >= 0.5 ? 'long' : 'short',
      stopLoss: getRandomFloat(options?.minStopLoss ?? 10, options?.maxStopLoss ?? 20),
      takeProfit: getRandomFloat(options?.minTakeProfit ?? 10, options?.maxTakeProfit ?? 20),
      closedBy: 'tp/sl',
      openDate: format(openDate, 'yyyy-MM-dd HH:mm'),
      closeDate: format(closeDate, 'yyyy-MM-dd HH:mm'),
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    };
  });

  return db.trades.bulkAdd(trades);
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
