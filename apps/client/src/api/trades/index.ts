import { client } from '../../lib/client';
import transformToFormData from '../../lib/transformToFormData';
import type { TradeFormSchemaType, TradesResult } from '../../types/trade';

export const getTrades = async () => {
  const response = await client.get<TradesResult>('trades');
  return response.data;
};

export const addTrade = async (trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  const response = await client.post('trades', transformToFormData(trade));
  return response.data;
};

export const editTrade = async (id: string, trade: TradeFormSchemaType & { tradingSessionId: number }) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await client.patch(`trades/${id}`, transformToFormData({ ...trade }));
  return response.data;
};

export const deleteTrade = async (id: string | undefined) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await client.delete(`trades/${id}`);
  return response.data;
};
