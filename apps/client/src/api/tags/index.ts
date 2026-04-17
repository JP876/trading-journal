import { axiosInstance } from '../../lib/axiosInstance';
import { getCurrentUser } from '../../lib/db/api/auth';
import { addTagDB, deleteTagDB, editTagDB, getTagsDB } from '../../lib/db/api/tags';
import transformToFormData from '../../lib/transformToFormData';
import withDelay from '../../lib/withDelay';
import type { PaginationInfo } from '../../types';
import type { GetTagsOptions, Tag, TagFormSchemaType } from '../../types/tag';

export const getTags = async (params?: GetTagsOptions) => {
  const user = await getCurrentUser();
  if (user?.isLoggedIn) {
    return getTagsDB(params);
  }

  const response = await withDelay(
    axiosInstance.get<PaginationInfo<Tag[]>>('tags', {
      params: {
        page: params?.page || undefined,
        limit: params?.rowsPerPage || undefined,
        title: params?.title || undefined,
      },
    }),
    0
  );
  return response.data;
};

export const addTag = async (tag: TagFormSchemaType) => {
  const user = await getCurrentUser();
  if (user?.isLoggedIn) {
    return addTagDB(tag);
  }

  const response = await axiosInstance.post('tags', transformToFormData(tag));
  return response.data;
};

export const editTag = async (id: number, tag: TagFormSchemaType) => {
  if (!id) {
    throw new Error(`Tag ID not found: ${id}`);
  }

  const user = await getCurrentUser();
  if (user?.isLoggedIn) {
    return editTagDB(id, tag);
  }

  const response = await axiosInstance.patch(`tags/${id}`, transformToFormData({ ...tag }));
  return response.data;
};

export const deleteTag = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`Tag ID not found: ${id}`);
  }

  const user = await getCurrentUser();
  if (user?.isLoggedIn) {
    return deleteTagDB(id);
  }

  const response = await axiosInstance.delete(`tags/${id}`);
  return response.data;
};
