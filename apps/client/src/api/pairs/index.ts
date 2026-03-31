import { axiosInstance } from '../../lib/axiosInstance';
import type { Pair } from '../../types/pair';

export const getPairs = async (): Promise<Pair[]> => {
  const response = await axiosInstance.get('pairs');
  return response.data;
};
