import { MuiColorInput, type MuiColorInputProps } from 'mui-color-input';

import type { FormField } from '../../../types';

type ColorInputPropsType = {
  field: FormField;
};

const ColorInput = ({
  field,
  ...rest
}: ColorInputPropsType & Omit<MuiColorInputProps, 'onChange' | 'value' | 'onBlur'>) => {
  return <MuiColorInput size="small" format="hsl" fullWidth {...rest} {...field} />;
};

export default ColorInput;
