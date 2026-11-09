import {
  columnSizingFeature,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/react-table';

export const tableMainFeatures = tableFeatures({
  rowSortingFeature: rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
  },
  columnSizingFeature: columnSizingFeature,
});
