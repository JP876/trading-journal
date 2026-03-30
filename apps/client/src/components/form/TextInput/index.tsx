import {
  type ControllerFieldState,
  type FieldValues,
  useFormContext,
  type UseFormStateReturn,
  type UseFormWatch,
} from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import type { FormField } from '../../../types';

type TextInputPropsType = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  label: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  inputProps?: TextFieldProps | ((options: { watch: UseFormWatch<FieldValues> }) => TextFieldProps);
  helperText?: string;
};

const TextInput = ({ field, fieldState, label, type, inputProps, helperText }: TextInputPropsType) => {
  const methods = useFormContext();

  const inputOptions = (() => {
    if (typeof inputProps === 'function') return inputProps({ watch: methods.watch });
    return inputProps;
  })();

  return (
    <FormControl fullWidth size="small" error={!!fieldState.error}>
      <TextField
        id={`${label}-form-text-field`}
        size="small"
        fullWidth
        label={label}
        type={type}
        {...inputOptions}
        {...field}
        value={field.value || ''}
        onChange={(e) => {
          if (inputOptions?.type === 'number' || type === 'number') {
            field.onChange(+e.target.value);
          } else {
            field.onChange(e.target.value);
          }
        }}
      />
      <FormHelperText>{!!fieldState.error ? fieldState.error.message : helperText || ' '}</FormHelperText>
    </FormControl>
  );
};

export default TextInput;
