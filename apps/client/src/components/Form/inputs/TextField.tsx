import { TextField, type TextFieldProps } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import { z } from 'zod';

import { useFieldContext } from '../formContext';

type FormTextFieldProps = {
  label: string;
} & Omit<TextFieldProps, 'onChange' | 'value' | 'onBlur'>;

const FormTextField = ({ label, ...rest }: FormTextFieldProps) => {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  const errText = errors
    .map((err: z.ZodError<any> | string) => (typeof err === 'string' ? err : err.message))
    .join(' ');

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      label={label}
      {...rest}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={!!errors.length || rest?.error}
      helperText={errors.length > 0 ? errText : rest?.helperText || ''}
    />
  );
};

export default FormTextField;
