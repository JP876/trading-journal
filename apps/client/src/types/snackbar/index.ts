import type { AlertProps, SnackbarProps } from '@mui/material';

export type AlertPropsType = Pick<AlertProps, 'severity' | 'variant'>;
export type SnackbarPropsType = Pick<SnackbarProps, 'autoHideDuration' | 'open'>;

export type SnackbarAtom = {
  message: string;
} & AlertPropsType &
  SnackbarPropsType;
