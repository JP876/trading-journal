import { axiosInstance } from '../../lib/axiosInstance';
import transformToFormData from '../../lib/transformToFormData';
import withDelay from '../../lib/withDelay';
import type { PaginationInfo } from '../../types';
import type { Tag, TagFormSchemaType } from '../../types/tag';

type GetTagsOptions = {
  page?: number;
  rowsPerPage?: number;
  title?: string;
};

export const getTags = async (params?: GetTagsOptions) => {
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
  const response = await axiosInstance.post('tags', transformToFormData(tag));
  return response.data;
};

export const editTag = async (id: number, tag: TagFormSchemaType) => {
  if (!id) {
    throw new Error(`Tag ID not found: ${id}`);
  }
  const response = await axiosInstance.patch(`tags/${id}`, transformToFormData({ ...tag }));
  return response.data;
};

export const deleteTag = async (id: number | undefined) => {
  if (!id) {
    throw new Error(`Tag ID not found: ${id}`);
  }
  const response = await axiosInstance.delete(`tags/${id}`);
  return response.data;
};
