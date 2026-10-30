import { atom } from 'jotai';

export type TRetryAtomValue = {
  isRetrying: boolean;
  count: number;
  error: Error | null;
};

export const retryAtom = atom<TRetryAtomValue>({
  isRetrying: false,
  count: 0,
  error: null,
});
