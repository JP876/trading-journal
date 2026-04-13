import { axiosInstance } from '../../lib/axiosInstance';
import { db } from '../../lib/db';
import { getCurrentUser } from '../../lib/db/api/auth';
import withDelay from '../../lib/withDelay';
import type { LoginFormData, RegisterFormData } from '../../types/auth';
import type { User } from '../../types/user';

type RefreshTokenData = { id: number };

export const registerUser = async (data: RegisterFormData) => {
  const response = await axiosInstance.post('auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginFormData) => {
  const response = await withDelay(axiosInstance.post('auth/login', data));
  return response.data;
};

export const logoutUser = async () => {
  const user = await getCurrentUser();
  if (user?.isLoggedIn) {
    return await db.users.update(user.id, { isLoggedIn: false });
  }

  const response = await axiosInstance.post('auth/logout');
  return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenData | null> => {
  const response = await axiosInstance.post('auth/refresh');
  return response.data;
};

export const getLoggedInUser = async () => {
  const user = await getCurrentUser();
  if (user) return user;

  const response = await axiosInstance.get<User>('auth/me');
  return response.data;
};
