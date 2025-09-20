import { format } from 'date-fns';

import { client } from '@/lib/client';
import transformToFormData from '@/lib/transformToFormData';
import { type TablePaginationType } from '@/types';
import {
  type TradeFilters,
  type EditTradeFormSchemaType,
  type TradeFormSchemaType,
  type TradesResult,
  type NumOfTradesPerDate,
  type GroupedByResult,
  type GroupedByPair,
  type MostProfitablePair,
  type GeneralStatsInfo,
} from '@/types/trades';

export const tradesLimit = 10;

export const getTrades = async ({
  page,
  rowsPerPage,
  sort,
  ...rest
}: TablePaginationType & TradeFilters & { sort?: string }): Promise<TradesResult> => {
  const response = await client.get('trades', {
    params: {
      page: page || 1,
      limit: rowsPerPage || tradesLimit,
      pair: rest?.pair || undefined,
      direction: rest?.direction || undefined,
      result: rest?.result || undefined,
      openDate: rest?.openDate ? format(new Date(rest?.openDate), 'yyyy/MM/dd') : undefined,
      closeDate: rest?.closeDate ? format(new Date(rest?.closeDate), 'yyyy/MM/dd') : undefined,
      sort: sort || undefined,
      tags: rest?.tags || undefined,
    },
  });
  return response.data;
};

export const getNumOfTradesPerDay = async (accountId: string): Promise<NumOfTradesPerDate[]> => {
  const response = await client.get(`trades/stats/num-of-trades-per-day/${accountId}`);
  return response.data;
};

export const getGroupedTradesByResult = async (accountId: string): Promise<GroupedByResult[]> => {
  const response = await client.get(`trades/stats/grouped-by-results/${accountId}`);
  return response.data;
};

export const getGroupedTradesByPair = async (accountId: string): Promise<GroupedByPair[]> => {
  const response = await client.get(`trades/stats/grouped-by-pairs/${accountId}`);
  return response.data;
};

export const getMostProfitablePairs = async (accountId: string): Promise<MostProfitablePair[]> => {
  const response = await client.get(`trades/stats/most-profitable-pairs/${accountId}`);
  return response.data;
};

export const getGeneralStatsInfo = async (accountId: string): Promise<GeneralStatsInfo> => {
  const response = await client.get(`trades/stats/general-info/${accountId}`);
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
