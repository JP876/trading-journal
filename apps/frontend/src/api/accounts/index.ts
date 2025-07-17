import { client } from '@/lib/client';
import { AccountFormSchemaType, AccountType } from '@/types/accounts';

export const getAccounts = async (): Promise<AccountType[]> => {
  const response = await client.get('accounts');
  return response.data;
};

export const addAccount = async (data: AccountFormSchemaType): Promise<AccountType | null> => {
  const response = await client.post('accounts', data);
  return response.data;
};

export const editAccount = async (id: string, data: Partial<AccountFormSchemaType>): Promise<AccountType | null> => {
  const response = await client.patch(`accounts/${id}`, data);
  return response.data;
};

export const deleteAccount = async (id: string | undefined) => {
  if (!id) {
    throw new Error(`Account ID not found: ${id}`);
  }
  const response = await client.delete(`accounts/${id}`);
  return response.data;
};
