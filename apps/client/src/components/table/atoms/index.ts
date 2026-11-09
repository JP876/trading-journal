import { atom } from 'jotai';

export type TTablePagination = {
  page: number;
  rowsPerPage: number;
};

export type TFilterValue = string | number | null;
export type TTableFilters = Record<string, TFilterValue>;

export const tablePaginationAtom = atom<TTablePagination>({ page: 1, rowsPerPage: 20 });
export const tableFiltersAtom = atom<TTableFilters>({});

export const updatePageAtom = atom(null, (get, set, value: number) => {
  set(tablePaginationAtom, { ...get(tablePaginationAtom), page: value });
});

export const updateRowsPerPageAtom = atom(null, (get, set, value: number) => {
  set(tablePaginationAtom, { ...get(tablePaginationAtom), rowsPerPage: value });
});

export const updateFiltersAtom = atom(null, (get, set, value: TTableFilters) => {
  set(tableFiltersAtom, { ...get(tableFiltersAtom), ...value });
});

export const resetFiltersAtom = atom(null, (_, set) => {
  set(tableFiltersAtom, {});
});
