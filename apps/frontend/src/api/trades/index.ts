import { client } from '@/lib/client';
import transformToFormData from '@/lib/transformToFormData';
import { TablePaginationType } from '@/types';
import {
  type TradeFilters,
  type EditTradeFormSchemaType,
  type TradeFormSchemaType,
  type TradesResult,
} from '@/types/trades';

export const tradesLimit = 10;

export const getTrades = async ({
  page,
  rowsPerPage,
  ...rest
}: TablePaginationType & TradeFilters): Promise<TradesResult> => {
  const response = await client.get('trades', {
    params: {
      page: page || 1,
      limit: rowsPerPage || tradesLimit,
      pair: rest?.pair || undefined,
      direction: rest?.direction || undefined,
      result: rest?.result || undefined,
    },
  });
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
