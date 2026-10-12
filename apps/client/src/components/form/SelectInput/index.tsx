import { useId } from 'react';
import Select, { type SelectChangeEvent, type SelectProps } from '@mui/material/Select';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import Chip, { type ChipProps } from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { type ControllerFieldState, type FieldValues, type UseFormStateReturn } from 'react-hook-form';

import type { FormField, SelectOption } from '../../../types';
import checkBrightness from '../../../lib/checkBrighness';

export type SelectInputOption<T = string | number> = SelectOption<T> & {
  menuItemProps?: MenuItemProps | ((options: { value: any }) => MenuItemProps);
  chipProps?: ChipProps;
  renderSubheader?: boolean;
};

type SelectInputPropsType = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  options: SelectInputOption[];
  label: string;
  renderChips?: boolean;
  inputProps?: SelectProps;
  helperText?: string;
  maxTags?: number;
  addAllOption?: boolean;
};

function SelectInput({
  field,
  fieldState,
  options,
  renderChips,
  label,
  inputProps,
  helperText,
  maxTags,
}: SelectInputPropsType) {
  const labelId = useId();

  const { value, name, onChange, ...restField } = field;
  const selectValue = inputProps?.multiple ? value || [] : value || '';

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (!inputProps?.multiple) {
      onChange(event.target.value);
      return;
    }

    if (!Array.isArray(event.target.value)) {
      console.warn('Select target value is not an array');
      return;
    }
    const nextValue = event.target.value;
    onChange(nextValue);
  };

  const handleRenderValue = (selected: any | any[]) => {
    if (!inputProps?.multiple) {
      const value = options.find((o) => o?.value === selected);
      return (
        <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
          {value?.label || ''}
        </Typography>
      );
    }

    if (!Array.isArray(selected)) return null;

    const formatedSelected: SelectInputOption[] = selected.reduce((acc, id) => {
      const option = options.find((option) => id === option.value);
      return option?.value ? [...acc, { ...option }] : acc;
    }, []);

    const rest = formatedSelected.slice(maxTags || 2).length;

    return (
      <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        {formatedSelected.slice(0, maxTags || 2).map(({ value, label, chipProps, chipBackground }) =>
          renderChips ? (
            <Chip
              key={value}
              label={label}
              {...(chipProps || {})}
              size="small"
              sx={(theme) => ({
                ...(typeof chipProps?.sx === 'function' ? chipProps?.sx(theme) : {}),
                height: '22px',
                backgroundColor: chipBackground,
                color: checkBrightness(chipBackground) ? 'white' : 'black',
              })}
            />
          ) : (
            <Typography key={value} variant="body1" sx={{ lineHeight: 1.4 }}>
              {label}
            </Typography>
          )
        )}
        {renderChips ? (
          <Chip
            sx={{ display: rest ? 'inline-flex' : 'none', height: '22px' }}
            size="small"
            label={`... ${rest}`}
          ></Chip>
        ) : (
          <Typography sx={{ display: rest ? 'block' : 'none' }}>{`... ${rest}`}</Typography>
        )}
      </Stack>
    );
  };

  return (
    <FormControl fullWidth size="small" error={!!fieldState.error}>
      <InputLabel htmlFor={`${label}-form-select`} id={labelId}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        renderValue={handleRenderValue}
        label={label}
        {...inputProps}
        slotProps={{
          ...inputProps?.slotProps,
          input: { id: `${label}-form-select`, ...inputProps?.slotProps?.input },
        }}
        value={selectValue}
        name={name}
        MenuProps={{
          ...inputProps?.MenuProps,
          PaperProps: {
            ...inputProps?.MenuProps?.PaperProps,
            sx: { maxHeight: '24rem', ...inputProps?.MenuProps?.PaperProps?.sx },
          },
        }}
        {...restField}
        onChange={handleChange}
      >
        {options.map(({ value, label, menuItemProps, renderSubheader }) => {
          const itemProps = typeof menuItemProps === 'function' ? menuItemProps({ value }) : menuItemProps;

          if (renderSubheader) {
            return <ListSubheader key={value}>{label}</ListSubheader>;
          }
          return (
            <MenuItem key={value} {...(itemProps || {})} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{!!fieldState.error ? fieldState.error.message : helperText || ' '}</FormHelperText>
    </FormControl>
  );
}

export default SelectInput;
