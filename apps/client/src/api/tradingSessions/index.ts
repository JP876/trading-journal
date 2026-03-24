import { client } from '../../lib/client';
import type { TradingSession, TradingSessionFormSchemaType } from '../../types/tradingSessions';

export const getTradingSessions = async (): Promise<TradingSession[]> => {
  const response = await client.get('trading-sessions');
  return response.data;
};

export const addTradingSession = async (data: TradingSessionFormSchemaType): Promise<TradingSession | null> => {
  const response = await client.post('trading-sessions', data);
  return response.data;
};

export const editTradingSession = async (
  id: number,
  data: Partial<TradingSessionFormSchemaType>
): Promise<TradingSession | null> => {
  const response = await client.patch(`trading-sessions/${id}`, data);
  return response.data;
};

export const deleteTradingSession = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`TradingSession ID not found: ${id}`);
  }
  const response = await client.delete(`trading-sessions/${id}`);
  return response.data;
};
