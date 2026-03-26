import { client } from '../../lib/client';
import transformToFormData from '../../lib/transformToFormData';
import type { TradeFormSchemaType, TradesResult } from '../../types/trade';

type GetTradesOptions = {
  page?: number;
  rowsPerPage?: number;
};

export const getTrades = async (params: GetTradesOptions) => {
  const response = await client.get<TradesResult>('trades', {
    params: {
      page: params.page || 1,
      limit: params.rowsPerPage || 10,
    },
  });
  return response.data;
};

export const addTrade = async (trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const response = await client.post('trades', transformToFormData(trade));
  return response.data;
};

export const editTrade = async (id: number, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await client.patch(`trades/${id}`, transformToFormData({ ...trade }));
  return response.data;
};

export const deleteTrade = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await client.delete(`trades/${id}`);
  return response.data;
};
