import { atom } from 'jotai';

import type { UserDB } from '../lib/db';
import type { User } from '../types/user';

export const userAtom = atom<UserDB | User | null>(null);
