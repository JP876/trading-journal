import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import createThemeSlice, { IThemeSlice } from './themeSlice';
import createModalSlice, { IModalSlice } from './modalSlice';
import createUserSlice, { IUserSlice } from './userSlice';

const useAppStore = create<IThemeSlice & IModalSlice & IUserSlice>()(
  devtools((...a) => ({
    ...createThemeSlice(...a),
    ...createModalSlice(...a),
    ...createUserSlice(...a),
  }))
);

export default useAppStore;
