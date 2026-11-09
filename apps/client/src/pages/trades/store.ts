import { createStore } from 'jotai';
import { tableFiltersAtom, tablePaginationAtom } from '../../components/table/atoms';

export const tradesTableStore = createStore();

tradesTableStore.set(tablePaginationAtom, { page: 1, rowsPerPage: 20 });
tradesTableStore.set(tableFiltersAtom, { pair: null, result: null, openDate: null, closeDate: null, tags: null });
