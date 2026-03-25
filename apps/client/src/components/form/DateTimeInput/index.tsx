import { renderTimeViewClock } from '@mui/x-date-pickers';
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers';

import type { FormField } from '../../../types';

type DateTimeInputProps = {
  field: FormField;
};

const DateTimeInput = ({ field, ...rest }: DateTimeInputProps & DateTimePickerProps) => {
  const { value, onChange, ...restField } = field;

  return (
    <DateTimePicker
      views={['year', 'month', 'day', 'hours', 'minutes']}
      format="dd/MM/yyyy HH:mm"
      ampm={false}
      slotProps={{ textField: { size: 'small', fullWidth: true } }}
      viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
      {...rest}
      value={value || null}
      onChange={(newValue) => onChange(newValue)}
      {...restField}
    />
  );
};

export default DateTimeInput;
