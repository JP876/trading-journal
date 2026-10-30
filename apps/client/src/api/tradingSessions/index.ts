import { axiosInstance } from '../../lib/axiosInstance';
import {
  addTradingSessionDB,
  deleteTradingSessionDB,
  editTradingSessionDB,
  getTradingSessionsDB,
} from '../../lib/db/api/tradingSessions';
import { isGuest } from '../../lib/utils';
import type { PaginationInfo } from '../../types';
import type {
  GetTradingSessionsOptions,
  TradingSession,
  TradingSessionFormSchemaType,
} from '../../types/tradingSessions';

export const getTradingSessions = async (params?: GetTradingSessionsOptions) => {
  if (isGuest()) {
    return await getTradingSessionsDB({ ...params });
  }

  const response = await axiosInstance.get<PaginationInfo<TradingSession[]>>('trading-sessions', {
    params: {
      page: params?.page || undefined,
      limit: params?.rowsPerPage || undefined,
      title: params?.title || undefined,
    },
  });
  return response.data;
};

export const addTradingSession = async (data: TradingSessionFormSchemaType) => {
  if (isGuest()) {
    return await addTradingSessionDB(data);
  }

  const response = await axiosInstance.post('trading-sessions', { ...data, isMain: +!!data.isMain });
  return response.data;
};

export const editTradingSession = async (id: number, data: Partial<TradingSessionFormSchemaType>) => {
  if (isGuest()) {
    return await editTradingSessionDB(id, data);
  }

  const response = await axiosInstance.patch(`trading-sessions/${id}`, { ...data, isMain: +!!data.isMain });
  return response.data;
};

export const deleteTradingSession = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`TradingSession ID not found: ${id}`);
  }

  if (isGuest()) {
    return await deleteTradingSessionDB(id);
  }

  const response = await axiosInstance.delete(`trading-sessions/${id}`);
  return response.data;
};
