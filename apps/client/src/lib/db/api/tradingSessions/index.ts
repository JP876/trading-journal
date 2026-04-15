import { format } from 'date-fns';

import { db } from '../..';
import type { PaginationInfo } from '../../../../types';
import type {
  GetTradingSessionsOptions,
  TradingSession,
  TradingSessionFormSchemaType,
} from '../../../../types/tradingSessions';
import type { Pair } from '../../../../types/pair';
import { findPairById } from '../pairs';
import handlePagination from '../../pagination';

const updateMainTradingSession = async (id: number) => {
  const sessions = await db.tradingSessions.toArray();
  await db.tradingSessions.bulkUpdate(
    sessions.filter((s) => s.id !== id).map((s) => ({ key: s.id, changes: { isMain: 0 } }))
  );
};

export const findMainTradingSession = async () => {
  const session = await db.tradingSessions.where('isMain').equals(1).first();
  if (!session) {
    throw new Error(`Trading session not found`);
  }
  return session;
};

export const findTradingSessionById = async (id: number) => {
  const session = await db.tradingSessions.where('id').equals(id).first();
  if (!session) {
    throw new Error(`Trading session with ID: ${id} not found`);
  }
  return session;
};

export const getTradingSessionsDB = async (
  params?: GetTradingSessionsOptions
): Promise<PaginationInfo<TradingSession[]>> => {
  let query = db.tradingSessions.reverse();
  const totalCount = await db.tradingSessions.count();

  if (params?.title) {
    const filter = (el: TradingSession) => {
      return el.title.toLowerCase().includes(params.title?.toLowerCase() || '');
    };
    query = query.filter(filter);
  }

  return { ...(await handlePagination(query, params)), totalItemsExcludingFilter: totalCount };
};

export const addTradingSessionDB = async (data: TradingSessionFormSchemaType) => {
  let pair: Pair | null = null;
  const { defaultPairId, ...session } = data;

  if (defaultPairId) {
    pair = await findPairById(defaultPairId);
  }

  const id = await db.tradingSessions.add({
    ...session,
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    defaultOpenDate: session.defaultOpenDate && format(session.defaultOpenDate, 'dd/MM/yyyy HH:mm'),
    defaultPair: pair,
    isMain: +!!data.isMain,
  });

  if (session.isMain) {
    await updateMainTradingSession(id);
  }
  return id;
};

export const editTradingSessionDB = async (id: number, data: Partial<TradingSessionFormSchemaType>) => {
  let pair: Pair | null = null;
  const { defaultPairId, ...rest } = data;

  if (defaultPairId) {
    pair = await findPairById(defaultPairId);
  }

  const session = await findTradingSessionById(id);

  session.title = rest.title ?? session.title;
  session.description = rest.description ?? session.description;
  session.isMain = +!!rest.isMain;
  session.defaultPair = pair || session.defaultPair;
  session.defaultOpenDate = rest.defaultOpenDate
    ? format(rest.defaultOpenDate, 'yyyy-MM-dd HH:mm')
    : session.defaultOpenDate;
  session.defaultTakeProfit = rest.defaultTakeProfit ?? session.defaultTakeProfit;
  session.defaultStopLoss = rest.defaultStopLoss ?? session.defaultStopLoss;
  session.updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm');

  if (session.isMain) {
    await updateMainTradingSession(id);
  }

  return await db.tradingSessions.update(id, session);
};

export const deleteTradingSessionDB = async (id: number) => {
  return db.tradingSessions.delete(id);
};
