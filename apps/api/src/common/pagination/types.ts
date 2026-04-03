export type Paginated<T> = {
  results: T;
  totalItems: number;
  totalItemsExcludingQuery: number;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
};
