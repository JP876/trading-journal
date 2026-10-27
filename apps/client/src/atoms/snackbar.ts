import { atom } from 'jotai';
import type { SnackbarAtom } from '../types/snackbar';

export const snackbarAtom = atom<SnackbarAtom>({ open: false, message: '' });

export const openSnackbarAtom = atom(null, (get, set, value: Omit<SnackbarAtom, 'open'>) => {
  let prevValue = get(snackbarAtom);
  set(snackbarAtom, { ...prevValue, ...value, open: true });
});

export const closeSnackbarAtom = atom(null, (get, set) => {
  let prevValue = get(snackbarAtom);
  set(snackbarAtom, { ...prevValue, open: false });
});
