import { atom, createStore } from 'jotai';
import type { ParseResult } from 'papaparse';

import type { Trade } from '../../../types/trade';

export const parsedFileResultAtom = atom<ParseResult<Trade> | null>(null);

export const importTradesStore = createStore();

export const resetStoreAtom = atom(null, () => {
  importTradesStore.set(parsedFileResultAtom, null);
});
