import { useId } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

import { FormFieldType, SelectOptionType } from '@/types';

type SelectInputPropsType = {
  field: FormFieldType;
  options: (SelectOptionType & { menuItemProps?: MenuItemProps })[];
};

const SelectInput = ({ field, options, ...rest }: SelectInputPropsType & SelectProps) => {
  const labelId = useId();
  const { value, ...restField } = field;

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{rest.label}</InputLabel>
      <Select labelId={labelId} id="simple-select" {...rest} value={value || ''} {...restField}>
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
