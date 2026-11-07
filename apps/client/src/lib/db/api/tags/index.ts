import { format } from 'date-fns';

import { db } from '../..';
import type { PaginationInfo } from '../../../../types';
import type { GetTagsOptions, Tag, TagFormSchemaType } from '../../../../types/tag';
import handlePagination from '../../pagination';
import { getRandomInt } from '../../../utils';

export const findTagById = async (id: number) => {
  const tag = await db.tags.where('id').equals(id).first();
  if (!tag) {
    throw new Error(`Tag with ID: ${id} not found`);
  }
  return tag;
};

export const getRandomTagIdsDB = (tags: Tag[]) => {
  return Array.from({ length: getRandomInt(0, tags.length) }).reduce<number[]>((acc) => {
    const t = tags[getRandomInt(0, tags.length - 1)];
    return acc.includes(t.id) ? acc : [...acc, t.id];
  }, []);
};

export const getTagsDB = async (user: number | string, params?: GetTagsOptions): Promise<PaginationInfo<Tag[]>> => {
  let query = db.tags.where({ user: user }).reverse();
  const totalCount = await db.tags.count();

  if (params?.title) {
    const filter = (el: Tag) => {
      return el.title.toLowerCase().includes(params.title?.toLowerCase() || '');
    };
    query = query.filter(filter);
  }

  return { ...(await handlePagination(query, params)), totalItemsExcludingFilter: totalCount };
};

export const addTagDB = async (user: number | string, tagData: TagFormSchemaType) => {
  return db.tags.add({
    ...tagData,
    createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    user: user,
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
