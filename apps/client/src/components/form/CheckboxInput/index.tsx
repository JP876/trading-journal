import Checkbox, { type CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel, { type FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormControl, { type FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { ControllerFieldState } from 'react-hook-form';

import type { FormField } from '../../../types';

type CheckboxInputProps = {
  field: FormField;
  fieldState: ControllerFieldState;
  label: string;
  helperText?: string;
  formControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
  formControlProps?: FormControlProps;
  checkboxProps: Omit<CheckboxProps, 'checked' | 'onChange'>;
};

const CheckboxInput = ({
  field,
  fieldState,
  label,
  helperText,
  formControlLabelProps,
  formControlProps,
  checkboxProps,
}: CheckboxInputProps) => {
  const { value, ...restField } = field;

  return (
    <FormControl
      component="fieldset"
      variant="standard"
      {...formControlProps}
      error={!!fieldState.error || formControlProps?.error}
    >
      <FormControlLabel
        labelPlacement="start"
        {...formControlLabelProps}
        label={label}
        control={
          <Checkbox
            slotProps={{ input: { 'aria-label': 'controlled' } }}
            {...checkboxProps}
            checked={!!value}
            {...restField}
          />
        }
      />
      <FormHelperText>{!!fieldState.error ? fieldState.error.message : helperText || ' '}</FormHelperText>
    </FormControl>
  );
};

export default CheckboxInput;
