import { format } from 'date-fns';

import { db } from '../..';
import type { PaginationInfo } from '../../../../types';
import type { GetTagsOptions, Tag, TagFormSchemaType } from '../../../../types/tag';
import handlePagination from '../../pagination';

export const findTagById = async (id: number) => {
  const tag = await db.tags.where('id').equals(id).first();
  if (!tag) {
    throw new Error(`Tag with ID: ${id} not found`);
  }
  return tag;
};

export const getTagsDB = async (params?: GetTagsOptions): Promise<PaginationInfo<Tag[]>> => {
  let query = db.tags.reverse();
  const totalCount = await db.tags.count();

  if (params?.title) {
    const filter = (el: Tag) => {
      return el.title.toLowerCase().includes(params.title?.toLowerCase() || '');
    };
    query = query.filter(filter);
  }

  return { ...(await handlePagination(query, params)), totalItemsExcludingFilter: totalCount };
};

export const addTagDB = async (tagData: TagFormSchemaType) => {
  return db.tags.add({
    ...tagData,
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
  });
};

export const editTagDB = async (id: number, tagData: TagFormSchemaType) => {
  return await db.tags
    .where('id')
    .equals(id)
    .modify({ ...tagData, updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm') });
};

export const deleteTagDB = async (id: number) => {
  return db.transaction('rw', db.tags, db.trades, async function () {
    await db.tags.delete(id);
    await db.trades
      .where('tags')
      .equals(id)
      .modify((trade) => {
        trade.tags = trade.tags.filter((tagId) => tagId !== id);
      });
  });
};
