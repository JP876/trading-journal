import { useId } from 'react';
import {
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  Stack,
  Typography,
  type ChipProps,
} from '@mui/material';
import Select, { type SelectProps } from '@mui/material/Select';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import { useStore } from '@tanstack/react-form';
import { z } from 'zod';

import type { SelectOption } from '../../../types';
import { useFieldContext } from '../formContext';
import checkBrightness from '../../../lib/checkBrighness';

export type SelectInputOption<T = string | number> = {
  value?: T;
  menuItemProps?: MenuItemProps;
  chipProps?: ChipProps;
} & Omit<SelectOption, 'value'>;

type SelectInputProps = {
  label: string;
  options: SelectInputOption[];
  renderChips?: boolean;
  inputProps?: SelectProps;
  helperText?: string;
};

const FormSelectField = ({ options, renderChips, label, inputProps, helperText }: SelectInputProps) => {
  const labelId = useId();

  const field = useFieldContext<SelectOption[] | SelectOption>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  const inputOptions = (() => {
    return inputProps;
  })();

  const selectValue = inputOptions?.multiple ? field.state.value || [] : field.state.value || '';
  const errText = errors
    .map((err: z.ZodError<any> | string) => (typeof err === 'string' ? err : err.message))
    .join(' ');

  const handleRenderValue = (selected: unknown) => {
    if (inputOptions?.multiple && Array.isArray(selected)) {
      const formatedSelected: SelectInputOption[] = selected
        .filter((option) => option?.value)
        .reduce((acc, id) => {
          const option = options.find((option) => id === option.value);
          return option?.value ? [...acc, { ...option }] : acc;
        }, []);

      return (
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {formatedSelected.map(({ value, label, chipProps, chipBackground }) =>
            renderChips ? (
              <Chip
                key={value}
                label={label}
                {...(chipProps || {})}
                size="small"
                sx={(theme) => ({
                  px: 0.6,
                  ...(typeof chipProps?.sx === 'function' ? chipProps?.sx(theme) : {}),
                  height: '22px',
                  backgroundColor: chipBackground,
                  color: checkBrightness(chipBackground) ? 'white' : 'black',
                })}
              />
            ) : (
              <Typography key={value} sx={{}}>
                {label}
              </Typography>
            )
          )}
        </Stack>
      );
    } else {
      const value = options.find((o) => o?.value === selected);
      return <Typography sx={{}}>{value?.label || ''}</Typography>;
    }
  };

  return (
    <FormControl fullWidth size="small" error={!!errors.length}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id="simple-select"
        renderValue={handleRenderValue}
        label={label}
        {...inputOptions}
        value={selectValue}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value as SelectOption[] | SelectOption)}
      >
        {options.map((option, key) => {
          if (!option.value) {
            return <ListSubheader key={key}>{option.value}</ListSubheader>;
          }
          return (
            <MenuItem key={option.value} {...(option.menuItemProps || {})} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
      {errText || helperText ? <FormHelperText>{errText || helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default FormSelectField;
