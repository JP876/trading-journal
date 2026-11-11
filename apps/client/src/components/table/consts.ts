import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";

export const tableMainFeatures = tableFeatures({
  columnFilteringFeature: columnFilteringFeature,
  globalFilteringFeature: globalFilteringFeature,
  filterFns: {
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
  },
  rowPaginationFeature: rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSortingFeature: rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  columnSizingFeature: columnSizingFeature,
  columnVisibilityFeature: columnVisibilityFeature,
});
