import { client } from '../../lib/client';
import type { Pair } from '../../types/pair';

export const getPairs = async (): Promise<Pair[]> => {
  const response = await client.get('pairs');
  return response.data;
};
