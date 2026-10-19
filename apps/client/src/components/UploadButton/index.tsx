import UploadIcon from '@mui/icons-material/Upload';
import Button, { type ButtonProps } from '@mui/material/Button';
import type { InputHTMLAttributes } from 'react';

import { VisuallyHiddenInput } from '../styledComps';

type TUploadButtonProps = InputHTMLAttributes<HTMLInputElement> & {
  buttonProps?: ButtonProps;
  children?: ButtonProps['children'];
};

const UploadButton = ({ buttonProps, children, ...rest }: TUploadButtonProps) => {
  return (
    <Button
      component="label"
      size="small"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<UploadIcon />}
      {...buttonProps}
    >
      {children || 'Upload files'}
      <VisuallyHiddenInput type="file" {...rest} />
    </Button>
  );
};

export default UploadButton;
