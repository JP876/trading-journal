import { memo, useMemo } from 'react';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';

import { SelectOptionType } from '@/types';
import { filtersAtom, pageAtom } from '../tableAtoms';

type TableSelectFilterType = {
  label: string;
  name: string;
};

type CustomAutocompletePropsType = Omit<
  AutocompleteProps<SelectOptionType, boolean | undefined, boolean | undefined, boolean | undefined>,
  'renderInput' | 'onChange' | 'value'
>;

const TableSelectFilter = ({ label, name, ...rest }: TableSelectFilterType & CustomAutocompletePropsType) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const setPage = useSetAtom(pageAtom);

  const filterValue = useMemo(() => filters?.[name], [filters?.[name]]);

  const value = useMemo(() => {
    if (!filterValue) return rest?.multiple ? [] : null;

    if (rest?.multiple) {
      return rest.options.filter((option) => filterValue?.includes(option.id));
    } else {
      return rest.options.find((option) => option.id === filterValue);
    }
  }, [filterValue, rest?.options, rest?.multiple]);

  const handleOnChange = (
    _: any,
    newValue: NonNullable<string | SelectOptionType> | (string | SelectOptionType)[] | null
  ) => {
    if (Array.isArray(newValue)) {
      setFilters((prevValue) => ({
        ...prevValue,
        [name]: newValue.map((value) => (typeof value === 'string' ? value : value?.id)).join(','),
      }));
    } else {
      setFilters((prevValue) => ({
        ...prevValue,
        [name]: typeof newValue === 'string' ? newValue : newValue?.id || '',
      }));
    }
    setPage(1);
  };

  return (
    <Autocomplete
      sx={{ minWidth: '12rem' }}
      size="small"
      {...rest}
      renderInput={(params) => <TextField {...params} size="small" label={label} />}
      value={value}
      onChange={handleOnChange}
    />
  );
};

export default memo(TableSelectFilter);
