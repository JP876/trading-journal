import { axiosInstance } from '../../lib/axiosInstance';
import transformToFormData from '../../lib/transformToFormData';
import type { Tag, TagFormSchemaType } from '../../types/tag';

export const getTags = async () => {
  const response = await axiosInstance.get<Tag[]>('tags');
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
