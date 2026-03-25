import { FormControl, FormHelperText } from '@mui/material';
import { renderTimeViewClock } from '@mui/x-date-pickers';
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers';
import { useStore } from '@tanstack/react-form';
import type { ZodError } from 'zod';

import { useFieldContext } from '../formContext';
import { useCallback } from 'react';
import type { PickerValue } from '@mui/x-date-pickers/internals';

type FormAutocompleteFieldProps = {
  helperText?: string;
} & Omit<DateTimePickerProps, 'value' | 'onChange'>;

const FormDateTimeField = ({ helperText, ...rest }: FormAutocompleteFieldProps) => {
  const field = useFieldContext<Date | null>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  const errText = errors.map((err: ZodError<any> | string) => (typeof err === 'string' ? err : err.message)).join(' ');

  const handleChange = useCallback((newValue: PickerValue) => {
    field.handleChange(newValue);
  }, []);

  return (
    <FormControl fullWidth size="small" error={!!errors.length}>
      <DateTimePicker
        views={['year', 'month', 'day', 'hours', 'minutes']}
        format="dd/MM/yyyy HH:mm"
        ampm={false}
        slotProps={{ textField: { size: 'small', fullWidth: true } }}
        viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
        {...rest}
        value={field.state.value || null}
        onChange={handleChange}
      />
      {errText || helperText ? <FormHelperText>{errText || helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default FormDateTimeField;
