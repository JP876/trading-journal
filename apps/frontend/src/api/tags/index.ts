import { client } from '@/lib/client';
import { TagFormSchemaType, TagType } from '@/types/tags';

export const getTags = async (): Promise<TagType[]> => {
  const response = await client.get('tags');
  return response.data;
};

export const addTag = async (data: TagFormSchemaType): Promise<TagType | null> => {
  const response = await client.post('tags', data);
  return response.data;
};

export const editTag = async (id: string, data: Partial<TagFormSchemaType>): Promise<TagType | null> => {
  const response = await client.patch(`tags/${id}`, data);
  return response.data;
};

export const deleteTag = async (id: string | undefined) => {
  if (!id) {
    throw new Error(`Tag ID not found: ${id}`);
  }
  const response = await client.delete(`tags/${id}`);
  return response.data;
};
