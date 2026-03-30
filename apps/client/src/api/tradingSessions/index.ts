import { client } from '../../lib/client';
import type { PaginationInfo } from '../../types';
import type { TradingSession, TradingSessionFormSchemaType } from '../../types/tradingSessions';

type GetTradesOptions = {
  page?: number;
  rowsPerPage?: number;
  title?: string;
};

export const getTradingSessions = async (params?: GetTradesOptions) => {
  const response = await client.get<PaginationInfo<TradingSession[]>>('trading-sessions', {
    params: {
      page: params?.page || 1,
      limit: params?.rowsPerPage || 10,
      title: params?.title || undefined,
    },
  });
  return response.data;
};

export const addTradingSession = async (data: TradingSessionFormSchemaType): Promise<TradingSession | null> => {
  const response = await client.post('trading-sessions', { ...data, isMain: +!!data.isMain });
  return response.data;
};

export const editTradingSession = async (
  id: number,
  data: Partial<TradingSessionFormSchemaType>
): Promise<TradingSession | null> => {
  const response = await client.patch(`trading-sessions/${id}`, { ...data, isMain: +!!data.isMain });
  return response.data;
};

export const deleteTradingSession = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`TradingSession ID not found: ${id}`);
  }
  const response = await client.delete(`trading-sessions/${id}`);
  return response.data;
};
