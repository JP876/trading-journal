import { client } from '../../lib/client';
import type { LoginFormData, RegisterFormData } from '../../types/auth';
import type { User } from '../../types/user';

type RefreshTokenData = { id: number };

export const registerUser = async (data: RegisterFormData) => {
  const response = await client.post('auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginFormData) => {
  const response = await client.post('auth/login', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await client.post('auth/logout');
  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenData | null> => {
  const response = await client.post('auth/refresh');
  return response.data;
};

export const getLoggedInUser = async () => {
  const response = await client.get<User>('auth/me');
  return response.data;
};
