import { atom } from 'jotai';
import type { SnackbarAtom } from '../types/snackbar';

export const snackbarAtom = atom<SnackbarAtom>({ open: false, message: '' });
