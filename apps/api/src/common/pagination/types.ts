export type Paginated<T> = {
  results: T;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};
