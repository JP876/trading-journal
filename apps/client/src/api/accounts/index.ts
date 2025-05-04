import { client } from '@/lib/client';
import { AccountFormSchemaType, AccountType } from '@/pages/trades/Accounts/types';

export const getAccounts = async (): Promise<AccountType[]> => {
  try {
    const response = await client.get('accounts');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch accounts');
  }
};

export const addAccount = async (data: AccountFormSchemaType): Promise<AccountType | null> => {
  const response = await client.post('accounts', data);
  return response.data;
};

export const updateAccount = async (id: string, data: Partial<AccountFormSchemaType>): Promise<AccountType | null> => {
  const response = await client.patch(`accounts/${id}`, data);
  return response.data;
};
