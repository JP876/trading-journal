import { type AlertColor, AlertPropsColorOverrides } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { StateCreator } from 'zustand';

type toastInfo = {
  open: boolean;
  severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
  message: string;
};

export interface IToastSlice {
  toastInfo: toastInfo;
  openToast: (info: Omit<toastInfo, 'open'>) => void;
  closeToast: () => void;
}

const createToastSlice: StateCreator<IToastSlice> = (set, get) => ({
  toastInfo: { open: false, message: '', severity: 'info' },
  openToast: (info: Omit<toastInfo, 'open'>) => {
    return set(() => ({ toastInfo: { ...info, open: true } }));
  },
  closeToast: () => {
    const toastInfo = get().toastInfo;
    return set(() => ({ toastInfo: { ...toastInfo, open: false } }));
  },
});

export default createToastSlice;
