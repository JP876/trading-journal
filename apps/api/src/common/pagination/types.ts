export type Paginated<T> = {
  results: T;
  totalItems: number;
  totalItemsExcludingFilter: number;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
};
