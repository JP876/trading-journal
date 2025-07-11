import { StateCreator } from 'zustand';

import { userType } from '@/types';

export interface IUserSlice {
  user: userType | null;
  setUser: (user: userType) => void;
}

const createUserSlice: StateCreator<IUserSlice> = (set) => ({
  user: null,
  setUser: (user: userType) => {
    return set(() => ({ user }));
  },
});

export default createUserSlice;
