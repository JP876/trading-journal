import { memo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';

import { SelectOptionType } from '@/types';
import { filtersAtom, pageAtom } from '../tableAtoms';

type TableSelectFilterType = {
  options: SelectOptionType[];
  label: string;
  name: string;
};

const TableSelectFilter = ({ options, label, name }: TableSelectFilterType) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const setPage = useSetAtom(pageAtom);

  const handleOnChange = (_: any, newValue: SelectOptionType | null) => {
    setFilters((prevValue) => ({ ...prevValue, [name]: newValue?.id || '' }));
    setPage(1);
  };

  return (
    <Autocomplete
      sx={{ width: '12rem' }}
      options={options}
      renderInput={(params) => <TextField {...params} size="small" label={label} />}
      value={filters?.[name] ? options.find((option) => option.id === filters?.[name]) : null}
      onChange={handleOnChange}
    />
  );
};

export default memo(TableSelectFilter);
