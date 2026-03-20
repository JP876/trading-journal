import { client } from '../../lib/client';
import type { LoginFormData, RegisterFormData } from '../../types/auth';

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
