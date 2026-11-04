import { atomWithStorage } from 'jotai/utils';

export const navigationDrawerAtom = atomWithStorage<{ open: boolean } | null>('navigationDrawer', null);
