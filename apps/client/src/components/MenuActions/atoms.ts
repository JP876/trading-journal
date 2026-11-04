import { atom, createStore } from 'jotai';

export const anchorElAtom = atom<null | HTMLElement>(null);

export const menuActionsStore = createStore();
menuActionsStore.set(anchorElAtom, null);
