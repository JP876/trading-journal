import { ForwardedRef, forwardRef, useId } from 'react';
import { FormControl, InputLabel } from '@mui/material';
import Select, { SelectProps, SelectChangeEvent } from '@mui/material/Select';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';

import { selectOptionType } from '@/types';

type selectInputPropsType = {
  options: (selectOptionType & { menuItemProps?: MenuItemProps })[];
  label: string;
  onChange: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void;
  value?: string;
  selectProps?: SelectProps;
};

const SelectInput = (props: selectInputPropsType, ref: ForwardedRef<HTMLElement>) => {
  const labelId = useId();

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{props.label}</InputLabel>
      <Select
        labelId={labelId}
        id="simple-select"
        {...props?.selectProps}
        label={props.label}
        onChange={props.onChange}
        value={props?.value || ''}
        ref={ref}
      >
        {props.options.map(({ id, label, menuItemProps }) => (
          <MenuItem key={id} {...(menuItemProps || {})} value={id}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default forwardRef(SelectInput);
