import Autocomplete, {
  type AutocompleteProps,
  type AutocompleteRenderValueGetItemProps,
} from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Store } from 'jotai';
import { memo, useCallback, useMemo } from 'react';

import checkBrightness from '../../../lib/checkBrighness';
import type { AutocompleteOption } from '../../../types';
import type { TFilterValue } from '../atoms';
import useFilter from '../hooks/useFilter';

type AutocompleteFilterProps = {
  label: string;
  name: string;
  initialValue?: TFilterValue;
  store?: Store;
};

type RenderValueType = NonNullable<string | AutocompleteOption> | (string | AutocompleteOption)[] | null;
type GetTagPropsType = AutocompleteRenderValueGetItemProps<boolean>;

type CustomAutocompleteProps = Omit<
  AutocompleteProps<AutocompleteOption, boolean | undefined, boolean | undefined, boolean | undefined>,
  'renderInput' | 'onChange' | 'value'
>;

const AutocompleteFilter = ({
  initialValue,
  label,
  name,
  store,
  ...rest
}: AutocompleteFilterProps & CustomAutocompleteProps) => {
  const [filterValue, handleFilterChange] = useFilter({ name, initialValue: initialValue || '', store });

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
    newValue: NonNullable<string | AutocompleteOption> | (string | AutocompleteOption)[] | null
  ) => {
    let value: string | number | null = null;

    if (Array.isArray(newValue)) {
      value = newValue.map((value) => (typeof value === 'string' ? value : value.value)).join(',');
    } else {
      value = typeof newValue === 'string' ? newValue : newValue?.value || '';
    }

    handleFilterChange(value);
  };

  const handleRenderValue = useCallback((value: RenderValueType, getTagProps: GetTagPropsType) => {
    if (Array.isArray(value)) {
      return value.map((option: AutocompleteOption | string, index: number) => {
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
    }

    return <Typography sx={{ lineHeight: 0, ml: 1 }}>{typeof value === 'string' ? value : value?.label}</Typography>;
  }, []);

  return (
    <Autocomplete
      size="small"
      fullWidth
      groupBy={(option) => option?.groupBy || ''}
      renderValue={handleRenderValue}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label={label}
          /* slotProps={{
            input: {
              endAdornment: <LoadingAdornment isLoading={!isPending} />,
            },
          }} */
        />
      )}
      {...rest}
      onChange={handleChange}
      value={value}
    />
  );
};

export default memo(AutocompleteFilter);
