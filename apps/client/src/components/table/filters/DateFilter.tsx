import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { format } from 'date-fns';
import type { Store } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import useFilter from '../hooks/useFilter';

type DateFilterProps = DateTimePickerProps & {
  name: string;
  store?: Store;
};

const DateFilter = ({ name, store, ...rest }: DateFilterProps) => {
  const dateRef = useRef<PickerValue | null>(null);
  const [date, setDate] = useState<PickerValue | null>(null);

  const [filterValue, handleFilterChange] = useFilter({ name, initialValue: null, wait: 0, store });

  const handleOnChange = (newValue: PickerValue) => {
    dateRef.current = newValue;
    setDate(newValue);
  };

  const handleClearValue = () => {
    handleFilterChange(null);
  };

  const handleOnClose = () => {
    if (dateRef.current === null) {
      setDate(null);
      return null;
    }
    handleFilterChange(dateRef.current ? format(dateRef.current, 'yyyy-MM-dd') : null);
  };

  useEffect(() => {
    if (filterValue) {
      setTimeout(() => setDate(new Date(filterValue)), 0);
    }
  }, []);

  return (
    <DateTimePicker
      views={['year', 'month', 'day']}
      format="dd/MM/yyyy"
      ampm={false}
      slotProps={{
        textField: { size: 'small', fullWidth: true },
        field: { clearable: true, onClear: () => handleClearValue() },
      }}
      {...rest}
      value={date}
      onChange={(newValue) => handleOnChange(newValue)}
      onClose={handleOnClose}
    />
  );
};

export default DateFilter;
