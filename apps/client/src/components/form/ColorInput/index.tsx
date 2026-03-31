import { MuiColorInput, type MuiColorInputProps } from 'mui-color-input';

import type { FormField } from '../../../types';

type ColorInputPropsType = {
  field: FormField;
  inputProps: Omit<MuiColorInputProps, 'onChange' | 'value' | 'onBlur'>;
};

const ColorInput = ({ field, inputProps }: ColorInputPropsType) => {
  return <MuiColorInput size="small" format="hsl" fullWidth {...inputProps} {...field} />;
};

export default ColorInput;
