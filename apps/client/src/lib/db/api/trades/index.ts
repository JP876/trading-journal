import { format } from 'date-fns';

import { db } from '../..';
import type { Trade, TradeFormSchemaType, TradesCount } from '../../../../types/trade';
import type { PaginationInfo } from '../../../../types';
import { findMainTradingSession } from '../tradingSessions';

export const getTradesCountPerTradingSessionDB = async (): Promise<TradesCount[]> => {
  const [sessions] = await Promise.all([db.tradingSessions.toArray(), db.trades.toArray()]);
  const result: TradesCount[] = [];

  for await (const session of sessions) {
    const count = await db.trades.filter((t) => t.tradingSession === session.id).count();
    result.push({ tradingSession: session.id, count });
  }

  return result;
};

export const getTradesDB = async (): Promise<PaginationInfo<Trade[]>> => {
  const session = await findMainTradingSession();
  const results = await db.trades.filter((t) => t.tradingSession === session.id).toArray();
  return { results, totalItems: results.length, totalItemsExcludingFilter: results.length };
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
