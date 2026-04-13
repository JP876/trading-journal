import { format } from 'date-fns';

import { db, type UserDB } from '../..';
import type { PaginationInfo } from '../../../../types';
import type { Tag, TagFormSchemaType } from '../../../../types/tag';

export const findTagById = async (id: number) => {
  const tag = await db.tags.where('id').equals(id).first();
  if (!tag) {
    throw new Error(`Tag with ID: ${id} not found`);
  }
  return tag;
};

export const getTagsDB = async (): Promise<PaginationInfo<Tag[]>> => {
  const results = await db.tags.toArray();
  return { results, totalItems: results.length, totalItemsExcludingFilter: results.length };
};

export const addTagDB = async (tagData: TagFormSchemaType, user: UserDB) => {
  const { isLoggedIn, ...rest } = user;
  return db.tags.add({
    ...tagData,
    user: { ...rest, email: '' },
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
  });
};

export const editTagDB = async (id: number, tagData: TagFormSchemaType) => {
  const tag = await findTagById(id);
  tag.title = tagData.title ?? tag.title;
  tag.color = tagData.color ?? tag.color;
  tag.updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm');
  return db.tags.update(id, tag);
};

export const deleteTagDB = async (id: number) => {
  return db.tags.delete(id);
};
