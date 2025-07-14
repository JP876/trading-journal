import { InputHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { ButtonProps } from '@mui/material';

import { FormFieldType } from '@/types';
import { FilesType } from '@/types/trades';

export type InputFileUploadProps = {
  buttonProps?: ButtonProps;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  children?: ReactNode;
};

export type FilesPreviewProps = {
  value: File[] | FilesType[] | undefined;
  handleDeleteFile: (e: MouseEvent<HTMLButtonElement>, index: number) => void;
};

export type UploadFilesInputProps = {
  field: FormFieldType;
};
