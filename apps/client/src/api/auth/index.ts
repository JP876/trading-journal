import { getDefaultStore } from 'jotai';
import { userAtom } from '../../atoms/user';
import { axiosInstance } from '../../lib/axiosInstance';
import { db } from '../../lib/db';
import { isGuest } from '../../lib/utils';
import withDelay from '../../lib/withDelay';
import type { LoginFormData, RegisterFormData } from '../../types/auth';
import type { User } from '../../types/user';

type RefreshTokenData = { id: number };

export const registerUser = async (data: RegisterFormData) => {
  const response = await axiosInstance.post('auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginFormData): Promise<User> => {
  const response = await withDelay(axiosInstance.post('auth/login', data));
  return response.data;
};

export const logoutUser = async () => {
  if (isGuest()) {
    const user = getDefaultStore().get(userAtom);
    return await db.users.update(user!.id, { isLoggedIn: false });
  }

  const response = await axiosInstance.post('auth/logout');
  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenData | null> => {
  const response = await axiosInstance.post('auth/refresh');
  return response.data;
};

export const getLoggedInUser = async () => {
  if (isGuest()) {
    return getDefaultStore().get(userAtom);
  }

  const response = await axiosInstance.get<User>('auth/me');
  return response.data;
};
