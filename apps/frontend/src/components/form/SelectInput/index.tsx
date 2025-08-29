import { useId } from 'react';
import { Chip, ChipProps, FormControl, InputLabel, Stack, Typography } from '@mui/material';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

import { FormFieldType, SelectOptionType } from '@/types';
import checkBrightness from '@/lib/checkBrightness';

export type SelectInputOptionType = SelectOptionType & {
  menuItemProps?: MenuItemProps;
  chipProps?: ChipProps;
  chipBackgroundColor?: string;
};
type SelectInputPropsType = {
  field: FormFieldType;
  options: SelectInputOptionType[];
  renderChips?: boolean;
};

const SelectInput = ({ field, options, renderChips, ...rest }: SelectInputPropsType & SelectProps) => {
  const labelId = useId();
  const { value, ...restField } = field;

  const selectValue = rest?.multiple ? value || [] : value || '';

  const handleRenderValue = (selected: unknown) => {
    if (rest?.multiple && Array.isArray(selected)) {
      const formatedSelected: SelectInputOptionType[] = selected.reduce((acc, id) => {
        const option = options.find((option) => id === option.id);
        return option?.id ? [...acc, { ...option }] : acc;
      }, []);

      return (
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {formatedSelected.map(({ id, label, chipProps, chipBackgroundColor }) =>
            renderChips ? (
              <Chip
                key={id}
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
              <Typography key={id} sx={{ lineHeight: 1.2 }}>
                {label}
              </Typography>
            )
          )}
        </Stack>
      );
    } else {
      const value = options.find((o) => o?.id === selected);
      return <Typography sx={{ lineHeight: 1.2 }}>{value?.label || ''}</Typography>;
    }
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{rest.label}</InputLabel>
      <Select
        labelId={labelId}
        id="simple-select"
        renderValue={handleRenderValue}
        {...rest}
        value={selectValue}
        {...restField}
      >
        {options.map(({ id, label, menuItemProps }) => (
          <MenuItem key={id} {...(menuItemProps || {})} value={id}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
