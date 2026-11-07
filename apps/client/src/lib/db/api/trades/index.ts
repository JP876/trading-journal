import { format, isBefore } from 'date-fns';

import { db } from '../..';
import { getPerformance } from '../../../../pages/dashboard/utils/performance';
import type { PaginationInfo } from '../../../../types';
import type { TGetTradesOptions, Trade, TradeFormSchemaType, TradesCount } from '../../../../types/trade';
import type { TradingSession } from '../../../../types/tradingSessions';
import handlePagination from '../../pagination';
import { findMainTradingSession } from '../tradingSessions';

export const getTradesCountPerTradingSessionDB = async (user: number | string): Promise<TradesCount[]> => {
  const sessions = await db.tradingSessions.where({ user: user }).toArray();
  const result: TradesCount[] = [];

  let index = 0;
  const sessionsCountArr = sessions.map((s) => {
    return db.trades.filter((t) => t.tradingSession === s.id).count();
  });

  for await (const count of sessionsCountArr) {
    result.push({ tradingSession: sessions[index].id, count });
    index++;
  }

  return result;
};

export const getTradesProfitDB = async (user: number | string, session: TradingSession) => {
  const trades = await db.trades.where({ tradingSession: session.id, user: user }).toArray();
  const performance = getPerformance(trades, session.accountSize);

  return {
    count: trades.length,
    profit: performance[performance.length - 1],
  };
};

export const getTradesDB = async (
  user: number | string,
  params: TGetTradesOptions
): Promise<PaginationInfo<Trade[]>> => {
  const [session] = await Promise.all([findMainTradingSession(user)]);
  const totalCount = await db.trades.where({ tradingSession: session.id, user: user }).count();

  const query = db.trades.where({ tradingSession: session.id, user: user }).filter((trade) => {
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

export const addTradeDB = async (user: number | string, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
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
    user: user,
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
