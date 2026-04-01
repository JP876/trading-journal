import { type ControllerFieldState, type FieldValues, type UseFormStateReturn } from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

import type { FormField } from '../../../types';

export type TextInputProps = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  label: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  helperText?: string;
  inputProps?: Omit<TextFieldProps, 'label' | 'value' | 'onChange' | 'helperText'>;
};

const TextInput = ({ field, fieldState, label, helperText, type, inputProps }: TextInputProps) => {
  return (
    <TextField
      id={`${label}-form-text-field`}
      size="small"
      fullWidth
      label={label}
      type={type}
      {...inputProps}
      {...field}
      helperText={!!fieldState.error ? fieldState.error.message : helperText || ' '}
      error={!!fieldState.error}
      value={field.value || ''}
      onChange={(e) => {
        if (inputProps?.type === 'number' || type === 'number') {
          field.onChange(+e.target.value);
        } else {
          field.onChange(e.target.value);
        }
      }}
    />
  );
};

export default TextInput;
