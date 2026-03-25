import { Checkbox, type CheckboxProps, FormControlLabel, type FormControlLabelProps } from '@mui/material';

import type { FormField } from '../../../types';

type CheckboxInputProps = {
  field: FormField;
  label: string;
  formControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
};

const CheckboxInput = ({
  field,
  label,
  formControlLabelProps,
  ...rest
}: CheckboxInputProps & Omit<CheckboxProps, 'checked' | 'onChange'>) => {
  const { value, ...restField } = field;

  return (
    <FormControlLabel
      labelPlacement="start"
      {...formControlLabelProps}
      label={label}
      control={
        <Checkbox
          size="small"
          slotProps={{ input: { 'aria-label': 'controlled' } }}
          {...rest}
          checked={!!value}
          {...restField}
        />
      }
    />
  );
};

export default CheckboxInput;
