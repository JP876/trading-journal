import { db } from '../..';

export const findPairById = async (id: number) => {
  const pair = await db.pairs.where('id').equals(id).first();
  if (!pair) {
    throw new Error(`Pair with ID: ${id} not found`);
  }
  return pair;
};
