import { axiosInstance } from '../../lib/axiosInstance';
import transformToFormData from '../../lib/transformToFormData';
import type { Result, TradeFormSchemaType, TradesResult } from '../../types/trade';

type GetTradesOptions = {
  page?: number;
  rowsPerPage?: number;
  pair?: number;
  result?: Result;
};

export const getTrades = async (params: GetTradesOptions) => {
  const response = await axiosInstance.get<TradesResult>('trades', {
    params: {
      page: params.page || 1,
      limit: params.rowsPerPage || 10,
      pairId: params.pair || undefined,
      result: params.result || undefined,
    },
  });
  return response.data;
};

export const addTrade = async (trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const response = await axiosInstance.post('trades', transformToFormData(trade));
  return response.data;
};

export const editTrade = async (id: number, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await axiosInstance.patch(`trades/${id}`, transformToFormData({ ...trade }));
  return response.data;
};

export const deleteTrade = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await axiosInstance.delete(`trades/${id}`);
  return response.data;
};
