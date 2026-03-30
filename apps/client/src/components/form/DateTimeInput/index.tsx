import { renderTimeViewClock } from '@mui/x-date-pickers';
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { ControllerFieldState } from 'react-hook-form';

import type { FormField } from '../../../types';

type DateTimeInputProps = {
  field: FormField;
  fieldState: ControllerFieldState;
  label: string;
  helperText?: string;
  inputProps?: Omit<DateTimePickerProps, 'label' | 'value' | 'onChange' | 'onBlur' | 'name'>;
};

const DateTimeInput = ({ label, field, fieldState, helperText, inputProps }: DateTimeInputProps) => {
  const { value, onChange, ...restField } = field;

  const handleChange = (newValue: PickerValue) => {
    onChange(newValue);
  };

  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <DateTimePicker
        label={label}
        views={['year', 'month', 'day', 'hours', 'minutes']}
        format="dd/MM/yyyy HH:mm"
        ampm={false}
        viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
        {...inputProps}
        slotProps={{
          textField: { size: 'small', fullWidth: true, ...inputProps?.slotProps?.textField },
          ...inputProps?.slotProps,
        }}
        value={value || null}
        onChange={handleChange}
        {...restField}
      />
      <FormHelperText>{!!fieldState.error ? fieldState.error.message : helperText || ' '}</FormHelperText>
    </FormControl>
  );
};

export default DateTimeInput;
