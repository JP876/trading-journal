import { client } from '@/lib/client';
import { AccountFormSchemaType, AccountType } from '@/pages/trades/Accounts/types';

export const getAccounts = async (): Promise<AccountType[]> => {
  const response = await client.get('accounts');
  if (response.statusText !== 'OK') throw new Error('Failed to fetch');
  return response.data;
};

export const addAccount = async (data: AccountFormSchemaType): Promise<AccountType | null> => {
  const response = await client.post('accounts', data);
  return response.data;
};

export const updateAccount = async (id: string, data: Partial<AccountFormSchemaType>): Promise<AccountType | null> => {
  const response = await client.patch(`accounts/${id}`, data);
  return response.data;
};
