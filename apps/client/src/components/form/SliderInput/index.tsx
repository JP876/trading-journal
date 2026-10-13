import type { ControllerFieldState, FieldValues, UseFormStateReturn } from 'react-hook-form';
import FormControl, { type FormControlProps } from '@mui/material/FormControl';
import FormControlLabel, { type FormControlLabelProps } from '@mui/material/FormControlLabel';
import Slider, { type SliderProps } from '@mui/material/Slider';
import FormHelperText from '@mui/material/FormHelperText';

import type { FormField } from '../../../types';

export type SliderInputProps = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  label: string;
  helperText?: string;
  formControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label'>;
  formControlProps?: FormControlProps;
  inputProps?: Omit<SliderProps, 'value' | 'onChange'>;
};

const SliderInput = ({
  field,
  fieldState,
  label,
  helperText,
  formControlProps,
  formControlLabelProps,
  inputProps,
}: SliderInputProps) => {
  const errorMessage = (() => {
    const msg = fieldState.error?.message;
    if (msg) return msg;
    if (Array.isArray(fieldState.error)) {
      return fieldState.error.map((value) => value?.message).join(' ');
    }
    return '';
  })();

  return (
    <FormControl
      component="fieldset"
      fullWidth
      variant="standard"
      sx={(theme) => ({ mb: theme.spacing(1) })}
      {...formControlProps}
      error={!!fieldState.error || formControlProps?.error}
    >
      <FormControlLabel
        labelPlacement="top"
        sx={{ alignItems: 'start' }}
        {...formControlLabelProps}
        label={label}
        control={<Slider size="small" valueLabelDisplay="auto" {...inputProps} {...field} />}
      />
      <FormHelperText>{!!fieldState.error ? errorMessage : helperText || ' '}</FormHelperText>
    </FormControl>
  );
};

export default SliderInput;
