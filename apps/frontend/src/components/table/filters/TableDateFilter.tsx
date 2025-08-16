import { useEffect, useRef, useState } from 'react';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { useAtom, useSetAtom } from 'jotai';

import { filtersAtom, pageAtom } from '../tableAtoms';

type TableDateFilter = {
  name: string;
};

const TableDateFilter = ({ name, ...rest }: TableDateFilter & DateTimePickerProps) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const setPage = useSetAtom(pageAtom);

  const value = filters?.[name];

  const dateRef = useRef<PickerValue | null>(null);
  const [date, setDate] = useState<PickerValue | null>(null);

  const handleOnChange = (newValue: PickerValue) => {
    dateRef.current = newValue;
    setDate(newValue);
  };

  const handleClearValue = () => {
    setFilters((prevValue) => ({ ...prevValue, [name]: null }));
    setPage(1);
  };

  const handleOnClose = () => {
    if (dateRef.current === null) {
      setDate(null);
      return null;
    }
    setFilters((prevValue) => ({ ...prevValue, [name]: dateRef.current?.toString() || null }));
    setPage(1);
  };

  useEffect(() => {
    if (value) {
      setTimeout(() => setDate(new Date(value)), 0);
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
      sx={{ width: '12rem', ...(rest?.sx || {}) }}
      value={date}
      onChange={(newValue) => handleOnChange(newValue)}
      onClose={handleOnClose}
    />
  );
};

export default TableDateFilter;
