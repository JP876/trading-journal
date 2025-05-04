import { UserFormSchema } from '@/components/UserSettings/types';
import { client } from '@/lib/client';

export const editLoggedInUser = async (user: UserFormSchema) => {
  const response = await client.patch(`user`, user);
  return response.data;
};

export const editLoggedInUserAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  const response = await client.patch(`user/avatar`, formData);
  return response.data;
};
