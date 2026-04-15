import type { Collection } from 'dexie';

import type { PaginationInfo } from '../../types';

export default async function handlePagination<T>(
  collection: Collection<T>,
  params?: { page?: number; rowsPerPage?: number }
) {
  let query = collection.clone();
  let countQuery = collection.clone();

  if (params?.rowsPerPage) {
    query = query.offset(params.rowsPerPage * ((params?.page || 1) - 1)).limit(params?.rowsPerPage);
  }

  const results = await query.toArray();
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
