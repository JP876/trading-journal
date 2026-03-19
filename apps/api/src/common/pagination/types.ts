export type Paginated<T> = {
  data: T;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};
