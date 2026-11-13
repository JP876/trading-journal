import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { ModalAtom, ModalInfo, TRetryAtomValue } from "../types";
import type { Pair } from "../types/pair";
import type { SnackbarAtom } from "../types/snackbar";
import type { User, UserDB } from "../types/user";

export const pairsAtom = atom<Pair[] | null>(null);

export const modalAtom = atom<ModalAtom>({});

export const openModalAtom = atom(null, (get, set, value: { id: string; data?: any } & ModalInfo) => {
  const { id, data, ...rest } = value;
  const prevData = get(modalAtom);
  set(modalAtom, { ...(prevData || {}), [id]: { data, ...rest } });
});

export const closeModalAtom = atom(null, (get, set, value: { id: string }) => {
  let prevData = get(modalAtom);
  delete prevData[value.id];
  set(modalAtom, { ...prevData });
});

export const navigationDrawerAtom = atomWithStorage<{ open: boolean } | null>("navigationDrawer", null);

export const retryAtom = atom<TRetryAtomValue>({
  isRetrying: false,
  count: 0,
  error: null,
});

export const snackbarAtom = atom<SnackbarAtom>({ open: false, message: "" });

export const openSnackbarAtom = atom(null, (get, set, value: Omit<SnackbarAtom, "open">) => {
  let prevValue = get(snackbarAtom);
  set(snackbarAtom, { ...prevValue, autoHideDuration: 5_000, ...value, open: true });
});

export const closeSnackbarAtom = atom(null, (get, set) => {
  let prevValue = get(snackbarAtom);
  set(snackbarAtom, { ...prevValue, open: false });
});

export const userAtom = atom<UserDB | User | null>(null);
export const userVarietyAtom = atom((get) => get(userAtom)?.variety);
