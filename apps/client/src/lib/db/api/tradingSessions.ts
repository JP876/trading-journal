import { format } from 'date-fns';

import { db } from '..';
import type { PaginationInfo } from '../../../types';
import type { TradingSession, TradingSessionFormSchemaType } from '../../../types/tradingSessions';

export const getTradingSessionsDB = async (): Promise<PaginationInfo<TradingSession[]>> => {
  const results = await db.tradingSessions.toArray();
  return { results, totalItems: results.length, totalItemsExcludingFilter: results.length };
};

export const addTradingSessionDB = async (data: TradingSessionFormSchemaType) => {
  return await db.tradingSessions.add({
    ...data,
    id: crypto.randomUUID(),
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    updatedAt: format(new Date(), 'yyyy-MM-dd'),
    defaultPair: null,
    isMain: +!!data.isMain,
  });
};
