import type { Collection } from 'dexie';

import type { PaginationInfo } from '../../types';

type TPaginationResult<T> = Omit<
  Pick<PaginationInfo, 'results' | 'totalItems'> | PaginationInfo<T>,
  'totalItemsExcludingFilter'
>;

export type TSortDirection = 'asc' | 'desc';

type TPaginationOptions<T> = {
  page?: number;
  rowsPerPage?: number;
  sortBy?: keyof T;
  direction?: TSortDirection;
};

export default async function handlePagination<T>(
  collection: Collection<T>,
  params?: TPaginationOptions<T>
): Promise<TPaginationResult<T>> {
  let query = collection.clone();
  let countQuery = collection.clone();
  let results;

  if (params?.rowsPerPage) {
    query = query.offset(params.rowsPerPage * ((params?.page || 1) - 1)).limit(params?.rowsPerPage);
  }

  if (params?.sortBy) {
    if (params.direction === 'asc') query = query.reverse();
    results = await query.sortBy(params.sortBy.toString());
  } else {
    results = await query.toArray();
  }

  const count = await countQuery.count();

  const finalData: Omit<PaginationInfo, 'totalItemsExcludingFilter'> = {
    results: results,
    totalItems: count,
  };

  if (params?.rowsPerPage) {
    finalData.totalPages = Math.ceil(count / params.rowsPerPage);
    finalData.itemsPerPage = params.rowsPerPage;
    finalData.currentPage = params?.page || 1;
  }

  return finalData;
}
