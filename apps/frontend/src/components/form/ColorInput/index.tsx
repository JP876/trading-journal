import { MuiColorInput, MuiColorInputProps } from 'mui-color-input';

import { FormFieldType } from '@/types';

type ColorInputPropsType = {
  field: FormFieldType;
};

const ColorInput = ({
  field,
  ...rest
}: ColorInputPropsType & Omit<MuiColorInputProps, 'onChange' | 'value' | 'onBlur'>) => {
  return <MuiColorInput size="small" format="hsl" fullWidth {...rest} {...field} />;
};

export default ColorInput;
