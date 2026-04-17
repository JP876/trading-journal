import { format, isBefore } from 'date-fns';

import { db } from '../..';
import type { GetTradesOptions, Trade, TradeFormSchemaType, TradesCount } from '../../../../types/trade';
import type { PaginationInfo } from '../../../../types';
import { findMainTradingSession } from '../tradingSessions';
import handlePagination from '../../pagination';

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
