import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import createModalSlice, { IModalSlice } from './modalSlice';
import createUserSlice, { IUserSlice } from './userSlice';
import createToastSlice, { IToastSlice } from './toastSlice';

const useAppStore = create<IModalSlice & IUserSlice & IToastSlice>()(
  devtools((...a) => ({
    ...createModalSlice(...a),
    ...createUserSlice(...a),
    ...createToastSlice(...a),
  }))
);

export default useAppStore;
