import { client } from '@/lib/client';
import { LoginFormType } from '@/pages/Auth/types';

type refreshTokenData = { _id: string };

export const refreshToken = async (): Promise<refreshTokenData | null> => {
  const response = await client.post('auth/refresh');
  return response.data;
};

export const getLoggedInUser = async () => {
  const response = await client.get('auth');
  return response.data;
};

/* export const registerUser = async (data: RegisterFormType) => {
  const response = await client.post('auth/register', data);
  return response.data;
}; */

export const loginUser = async (data: LoginFormType) => {
  const response = await client.post('auth/login', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await client.post('auth/logout');
  return response.data;
};
