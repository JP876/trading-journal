import { atom } from 'jotai';

export const pageAtom = atom(1);
export const rowsPerPageAtom = atom(10);
export const filtersAtom = atom<{ [key: string]: string }>({});
