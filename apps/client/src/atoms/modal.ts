import { atom } from 'jotai';

import type { ModalAtom } from '../types';

export const modalAtom = atom<ModalAtom>({});

export const openModalAtom = atom(null, (get, set, value: { id: string; data?: any }) => {
  let prevData = get(modalAtom);
  set(modalAtom, { ...(prevData || {}), [value.id]: { data: value.data } });
});

export const closeModalAtom = atom(null, (get, set, value: { id: string }) => {
  let prevData = get(modalAtom);
  delete prevData[value.id];
  set(modalAtom, { ...prevData });
});
