import { atom } from 'jotai';

import type { User, UserDB } from '../types/user';

export const userAtom = atom<UserDB | User | null>(null);
