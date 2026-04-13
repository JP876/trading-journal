import { axiosInstance } from '../../lib/axiosInstance';
import { db, getCurrentUser } from '../../lib/db';
import type { Pair } from '../../types/pair';

export const getPairs = async (): Promise<Pair[]> => {
  const response = await axiosInstance.get('pairs');

  const user = await getCurrentUser();
  if (user?.isLoggedIn) {
    const pairs = await db.pairs.toArray();
    if (!pairs || pairs.length === 0) await db.pairs.bulkAdd(response.data);
  }

  return response.data;
};
