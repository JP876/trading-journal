import { useId } from 'react';
import Select, { type SelectProps } from '@mui/material/Select';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import Chip, { type ChipProps } from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { type FieldValues, useFormContext, type UseFormWatch } from 'react-hook-form';

import type { FormField, SelectOption } from '../../../types';
import checkBrightness from '../../../lib/checkBrighness';

export type SelectInputOption<T = string | number> = SelectOption<T> & {
  menuItemProps?: MenuItemProps | ((options: { value: any; watch: UseFormWatch<FieldValues> }) => MenuItemProps);
  chipProps?: ChipProps;
  chipBackgroundColor?: string;
  renderSubheader?: boolean;
};
type SelectInputPropsType = {
  field: FormField;
  options: SelectInputOption[];
  renderChips?: boolean;
  label: string;
  inputProps?: ((options: { watch: UseFormWatch<FieldValues> }) => SelectProps) | SelectProps;
};

function SelectInput({ field, options, renderChips, label, inputProps }: SelectInputPropsType) {
  const labelId = useId();
  const methods = useFormContext();

  const inputOptions = (() => {
    if (typeof inputProps === 'function') return inputProps({ watch: methods.watch });
    return inputProps;
  })();

  const { value, ...restField } = field;
  const selectValue = inputOptions?.multiple ? value || [] : value || '';

  const handleRenderValue = (selected: unknown) => {
    if (inputOptions?.multiple && Array.isArray(selected)) {
      const formatedSelected: SelectInputOption[] = selected.reduce((acc, id) => {
        const option = options.find((option) => id === option.value);
        return option?.value ? [...acc, { ...option }] : acc;
      }, []);

      return (
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {formatedSelected.map(({ value, label, chipProps, chipBackgroundColor }) =>
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
                  backgroundColor: chipBackgroundColor,
                  color: checkBrightness(chipBackgroundColor) ? 'white' : 'black',
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
    <FormControl fullWidth size="small">
      <InputLabel htmlFor={`${label}-form-select`} id={labelId}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        renderValue={handleRenderValue}
        label={label}
        {...inputOptions}
        slotProps={{
          ...inputOptions?.slotProps,
          input: { id: `${label}-form-select`, ...inputOptions?.slotProps?.input },
        }}
        value={selectValue}
        {...restField}
      >
        {options.map(({ value, label, menuItemProps, renderSubheader }) => {
          const itemProps =
            typeof menuItemProps === 'function' ? menuItemProps({ value, watch: methods.watch }) : menuItemProps;

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
    </FormControl>
  );
}

export default SelectInput;
