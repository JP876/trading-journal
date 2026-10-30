import { axiosInstance } from '../../lib/axiosInstance';
import { db } from '../../lib/db';
import type { Pair } from '../../types/pair';

export const getPairs = async (): Promise<Pair[]> => {
  const pairs = await db.pairs.toArray();
  if (pairs.length > 0) {
    return pairs;
  }

  const response = await axiosInstance.get('pairs');
  await db.pairs.bulkAdd(response.data);

  return await db.pairs.toArray();
};
