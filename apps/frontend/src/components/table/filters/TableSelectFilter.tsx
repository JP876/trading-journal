import { memo, useCallback, useMemo } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderValueGetItemProps,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';

import { SelectOptionType } from '@/types';
import { filtersAtom, pageAtom } from '../tableAtoms';
import checkBrightness from '@/lib/checkBrightness';

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
    _: React.SyntheticEvent,
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

  const handleRenderValue = useCallback(
    (
      value: NonNullable<string | SelectOptionType> | (string | SelectOptionType)[] | null,
      getTagProps: AutocompleteRenderValueGetItemProps<boolean>
    ) => {
      if (Array.isArray(value)) {
        return value.map((option: SelectOptionType | string, index: number) => {
          const tagProps = getTagProps({ index });
          const { className, disabled, tabIndex, onDelete } = tagProps;

          return (
            <Chip
              key={index}
              variant="outlined"
              size="small"
              data-item-index={tagProps?.['data-item-index']}
              className={className}
              disabled={disabled}
              tabIndex={tabIndex}
              onDelete={onDelete}
              label={typeof option === 'string' ? option : option?.label}
              sx={[
                { height: '24px' },
                (theme) =>
                  typeof option !== 'string' && option?.chipBackground
                    ? {
                        backgroundColor: option.chipBackground,
                        color: checkBrightness(option.chipBackground)
                          ? theme.palette.common.white
                          : theme.palette.common.black,
                      }
                    : {},
              ]}
            />
          );
        });
      } else {
        return <Typography ml={1}>{typeof value === 'string' ? value : value?.label}</Typography>;
      }
    },
    []
  );

  return (
    <Autocomplete
      size="small"
      fullWidth
      renderValue={handleRenderValue}
      renderInput={(params) => <TextField {...params} size="small" label={label} />}
      {...rest}
      onChange={handleOnChange}
      value={value}
    />
  );
};

export default memo(TableSelectFilter);
