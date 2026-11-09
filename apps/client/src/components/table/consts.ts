import {
  columnFilteringFeature,
  columnSizingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table';

export const tableMainFeatures = tableFeatures({
  columnFilteringFeature: columnFilteringFeature,
  globalFilteringFeature: globalFilteringFeature,
  rowPaginationFeature: rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSortingFeature: rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  columnSizingFeature: columnSizingFeature,
});
