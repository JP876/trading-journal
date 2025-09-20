import { FieldValues, useFormContext, UseFormWatch } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

import { FormFieldType } from '@/types';

type TextInputPropsType = {
  field: FormFieldType;
  label: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  inputProps?: TextFieldProps | ((options: { watch: UseFormWatch<FieldValues> }) => TextFieldProps);
};

const TextInput = ({ field, label, type, inputProps }: TextInputPropsType) => {
  const methods = useFormContext();

  const inputOptions = (() => {
    if (typeof inputProps === 'function') return inputProps({ watch: methods.watch });
    return inputProps;
  })();

  return (
    <TextField
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
  );
};

export default TextInput;
