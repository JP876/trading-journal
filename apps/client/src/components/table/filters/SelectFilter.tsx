import { useCallback, useMemo } from 'react';
import Autocomplete, {
  type AutocompleteProps,
  type AutocompleteRenderValueGetItemProps,
} from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import type { SelectOption } from '../../../types';
import { useFiltersDispatch, useFiltersState } from '../providers/Filters';
import { usePaginationDispatch } from '../providers/Pagination';
import checkBrightness from '../../../lib/checkBrighness';

type SelectFilterProps = {
  label: string;
  name: string;
};

type RenderValueType = NonNullable<string | SelectOption> | (string | SelectOption)[] | null;
type GetTagPropsType = AutocompleteRenderValueGetItemProps<boolean>;

type CustomAutocompleteProps = Omit<
  AutocompleteProps<SelectOption, boolean | undefined, boolean | undefined, boolean | undefined>,
  'renderInput' | 'onChange' | 'value'
>;

const SelectFilter = ({ label, name, ...rest }: SelectFilterProps & CustomAutocompleteProps) => {
  const filters = useFiltersState();
  const filtersDispatch = useFiltersDispatch();

  const paginationDispatch = usePaginationDispatch();

  const filterValue = useMemo(() => filters?.[name], [filters?.[name]]);

  const value = useMemo(() => {
    if (!filterValue) return rest?.multiple ? [] : null;

    if (rest?.multiple) {
      return rest.options.filter((option) =>
        typeof filterValue === 'string' ? filterValue.includes(option.value.toString()) : filterValue === option.value
      );
    } else {
      return rest.options.find((option) => option.value === filterValue);
    }
  }, [filterValue, rest?.options, rest?.multiple]);

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: NonNullable<string | SelectOption> | (string | SelectOption)[] | null
  ) => {
    let value: string | number | null = null;

    if (Array.isArray(newValue)) {
      value = newValue.map((value) => (typeof value === 'string' ? value : value.value)).join(',');
    } else {
      value = typeof newValue === 'string' ? newValue : newValue?.value || '';
    }

    filtersDispatch({ type: 'updateFilter', value: { id: name, value } });
    paginationDispatch({ type: 'updatePage', value: 1 });
  };

  const handleRenderValue = useCallback((value: RenderValueType, getTagProps: GetTagPropsType) => {
    if (Array.isArray(value)) {
      return value.map((option: SelectOption | string, index: number) => {
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
      return (
        <Typography ml={1} sx={{ lineHeight: 0 }}>
          {typeof value === 'string' ? value : value?.label}
        </Typography>
      );
    }
  }, []);

  return (
    <Autocomplete
      size="small"
      fullWidth
      renderValue={handleRenderValue}
      renderInput={(params) => <TextField {...params} size="small" label={label} />}
      {...rest}
      onChange={handleChange}
      value={value}
    />
  );
};

export default SelectFilter;
