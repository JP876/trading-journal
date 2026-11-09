import type { PaginationState, SortingState } from '@tanstack/react-table';
import { atom } from 'jotai';

export type TFilterValue = string | number | null;
export type TTableFilters = Record<string, TFilterValue>;

export const tablePaginationAtom = atom<PaginationState>({ pageIndex: 0, pageSize: 20 });
export const tableSortingAtom = atom<SortingState>([]);
export const tableFiltersAtom = atom<TTableFilters>({});

export const updatePageAtom = atom(null, (get, set, value: number) => {
  set(tablePaginationAtom, { ...get(tablePaginationAtom), pageIndex: value });
});

export const updateRowsPerPageAtom = atom(null, (get, set, value: number) => {
  set(tablePaginationAtom, { ...get(tablePaginationAtom), pageSize: value });
});

export const updateFiltersAtom = atom(null, (get, set, value: TTableFilters) => {
  set(tableFiltersAtom, { ...get(tableFiltersAtom), ...value });
});

export const resetFiltersAtom = atom(null, (_, set) => {
  set(tableFiltersAtom, {});
});
