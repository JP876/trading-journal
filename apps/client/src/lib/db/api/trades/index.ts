import { format } from 'date-fns';

import { db } from '../..';
import type { Trade, TradeFormSchemaType, TradesCount } from '../../../../types/trade';
import type { PaginationInfo } from '../../../../types';
import { findMainTradingSession } from '../tradingSessions';
import type { Tag } from '../../../../types/tag';

const getPairAndSession = async (pairId: number, tradingSessionId: number) => {
  const [session, pair] = await Promise.all([
    db.tradingSessions.where('id').equals(tradingSessionId).first(),
    db.pairs.where('id').equals(pairId).first(),
  ]);

  if (!session || !pair) {
    throw new Error('Trading session and/or pair not found');
  }

  return { pair: pair, tradingSession: session };
};

const findTags = async (ids: number[] | undefined) => {
  const tags: Tag[] = [];
  if (Array.isArray(ids) && ids.length > 0) {
    for await (const id of ids) {
      const tag = await db.tags.where('id').equals(id).first();
      if (tag) tags.push(tag);
    }
  }
  return tags;
};

export const getTradesCountPerTradingSessionDB = async (): Promise<TradesCount[]> => {
  const [sessions] = await Promise.all([db.tradingSessions.toArray(), db.trades.toArray()]);
  const result: TradesCount[] = [];

  for await (const session of sessions) {
    const count = await db.trades.filter((t) => t.tradingSession.id === session.id).count();
    result.push({ tradingSession: session.id, count });
  }

  return result;
};

export const getTradesDB = async (): Promise<PaginationInfo<Trade[]>> => {
  const session = await findMainTradingSession();
  const results = await db.trades.filter((t) => t.tradingSession.id === session.id).toArray();
  return { results, totalItems: results.length, totalItemsExcludingFilter: results.length };
};

export const addTradeDB = async (trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const { tradingSessionId, pairId, ...restTrade } = trade;
  const { pair, tradingSession } = await getPairAndSession(pairId, tradingSessionId);

  const tags = await findTags(trade.tags);

  return db.trades.add({
    ...restTrade,
    tags: tags,
    tradingSession: tradingSession,
    pair: pair,
    openDate: trade.openDate && format(trade.openDate, 'dd/MM/yyyy HH:mm'),
    closeDate: trade.closeDate && format(trade.closeDate, 'dd/MM/yyyy HH:mm'),
    createdAt: format(new Date(), 'dd/MM/yyyy HH:mm'),
    updatedAt: format(new Date(), 'dd/MM/yyyy HH:mm'),
  });
};

export const editTradeDB = async (id: number, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const { tradingSessionId, pairId, ...restTrade } = trade;
  const { pair, tradingSession } = await getPairAndSession(pairId, tradingSessionId);

  const tags = await findTags(trade.tags);

  return db.trades.update(id, {
    ...restTrade,
    tags: tags,
    tradingSession: tradingSession,
    pair: pair,
    openDate: trade.openDate && format(trade.openDate, 'dd/MM/yyyy HH:mm'),
    closeDate: trade.closeDate && format(trade.closeDate, 'dd/MM/yyyy HH:mm'),
    updatedAt: format(new Date(), 'dd/MM/yyyy HH:mm'),
  });
};

export const deleteTradeDB = async (id: number) => {
  return db.trades.delete(id);
};
