import type { ControllerFieldState, FieldValues, UseFormStateReturn } from 'react-hook-form';
import { MuiColorInput, type MuiColorInputProps } from 'mui-color-input';

import type { FormField } from '../../../types';

type ColorInputPropsType = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  label: string;
  helperText?: string;
  inputProps?: Omit<MuiColorInputProps, 'onChange' | 'value' | 'onBlur'>;
};

const ColorInput = ({ field, fieldState, helperText, label, inputProps }: ColorInputPropsType) => {
  return (
    <MuiColorInput
      size="small"
      format="hsl"
      label={label}
      fullWidth
      helperText={!!fieldState.error ? fieldState.error.message : helperText || ' '}
      error={!!fieldState.error}
      {...inputProps}
      {...field}
    />
  );
};

export default ColorInput;
