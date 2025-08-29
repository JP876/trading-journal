import { TextField, TextFieldProps } from '@mui/material';

import { FormFieldType } from '@/types';

type TextInputPropsType = {
  field: FormFieldType;
};

const TextInput = ({ field, ...rest }: TextInputPropsType & TextFieldProps) => {
  return (
    <TextField
      size="small"
      fullWidth
      {...rest}
      {...field}
      value={field.value || ''}
      onChange={(e) => {
        if (rest?.type === 'number') {
          field.onChange(+e.target.value);
        } else {
          field.onChange(e.target.value);
        }
      }}
    />
  );
};

export default TextInput;
