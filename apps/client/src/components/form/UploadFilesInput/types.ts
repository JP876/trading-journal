import { type ButtonProps } from '@mui/material';
import type { Files, FormField } from '../../../types';

export type InputFileUploadProps = {
  buttonProps?: ButtonProps;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  children?: React.ReactNode;
};

export type FilesPreviewProps = {
  value: File[] | Files[] | undefined;
  handleDeleteFile: (e: React.MouseEvent<HTMLButtonElement>, index: number, file: Files | null) => void;
};

export type UploadFilesInputProps = {
  field: FormField;
};
