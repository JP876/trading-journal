import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { addHours } from 'date-fns';

import type { DateTimeInputProps } from '../../../components/form/DateTimeInput';
import DateTimeInput from '../../../components/form/DateTimeInput';

type CloseDateInputProps = Pick<DateTimeInputProps, 'field' | 'fieldState' | 'formState'> & { addHoursCount?: number };

const CloseDateInput = ({ field, fieldState, formState, addHoursCount }: CloseDateInputProps) => {
  const [openDate] = useWatch({ name: ['openDate'] });
  const methods = useFormContext();

  useEffect(() => {
    if (!fieldState.isDirty && openDate) {
      methods.setValue('closeDate', addHours(new Date(openDate), addHoursCount || 1));
    }
  }, [fieldState.isDirty, openDate]);

  return (
    <DateTimeInput
      label="Close Date"
      inputProps={{ disableFuture: true, minDate: openDate }}
      field={field}
      fieldState={fieldState}
      formState={formState}
    />
  );
};

export default CloseDateInput;
