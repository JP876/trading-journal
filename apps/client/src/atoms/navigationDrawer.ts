import { atomWithStorage } from 'jotai/utils';

export const navigationDrawer = atomWithStorage<{ open: boolean } | null>('navigationDrawer', null);
