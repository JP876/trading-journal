import { client } from '@/lib/client';
import transformToFormData from '@/lib/transformToFormData';
import { EditTradeFormSchemaType, TradeFormSchemaType, TradeType } from '@/types/trades';

type getTradesResult = { results: TradeType[]; count: number };

export const tradesLimit = 10;

export const getTrades = async (page: number): Promise<getTradesResult> => {
  const response = await client.get('trades', { params: { page, limit: tradesLimit } });
  return response.data;
};

export const addTrade = async (trade: TradeFormSchemaType) => {
  const response = await client.post('trades', transformToFormData(trade));
  return response.data;
};

export const editTrade = async (id: string, trade: EditTradeFormSchemaType) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }

  const response = await client.patch(
    `trades/${id}`,
    transformToFormData({ ...trade, deleteFiles: JSON.stringify(trade?.deleteFiles) })
  );
  return response.data;
};

export const deleteTrade = async (id: string | undefined) => {
  if (!id) {
    throw new Error(`Trade ID not found: ${id}`);
  }
  const response = await client.delete(`trades/${id}`);
  return response.data;
};
