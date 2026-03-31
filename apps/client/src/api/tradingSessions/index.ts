import { axiosInstance } from '../../lib/axiosInstance';
import type { PaginationInfo } from '../../types';
import type { TradingSession, TradingSessionFormSchemaType } from '../../types/tradingSessions';

type GetTradesOptions = {
  page?: number;
  rowsPerPage?: number;
  title?: string;
};

export const getTradingSessions = async (params?: GetTradesOptions) => {
  const response = await axiosInstance.get<PaginationInfo<TradingSession[]>>('trading-sessions', {
    params: {
      page: params?.page || undefined,
      limit: params?.rowsPerPage || undefined,
      title: params?.title || undefined,
    },
  });
  return response.data;
};

export const addTradingSession = async (data: TradingSessionFormSchemaType): Promise<TradingSession | null> => {
  const response = await axiosInstance.post('trading-sessions', { ...data, isMain: +!!data.isMain });
  return response.data;
};

export const editTradingSession = async (
  id: number,
  data: Partial<TradingSessionFormSchemaType>
): Promise<TradingSession | null> => {
  const response = await axiosInstance.patch(`trading-sessions/${id}`, { ...data, isMain: +!!data.isMain });
  return response.data;
};

export const deleteTradingSession = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`TradingSession ID not found: ${id}`);
  }
  const response = await axiosInstance.delete(`trading-sessions/${id}`);
  return response.data;
};
