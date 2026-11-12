import { type ChipProps } from "@mui/material/Chip";
import FormControl, { type FormControlProps } from "@mui/material/FormControl";
import FormHelperText, { type FormHelperTextProps } from "@mui/material/FormHelperText";
import InputLabel, { type InputLabelProps } from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import Select, { type SelectProps } from "@mui/material/Select";
import { useId } from "react";

import type { SelectOption } from "../../types";

export type TSelectInputOption<T = string | number> = SelectOption<T> & {
  menuItemProps?: MenuItemProps | ((options: { value: any }) => MenuItemProps);
  chipProps?: ChipProps;
  renderSubheader?: boolean;
};

export type TSelectInputProps<TValue> = {
  options: TSelectInputOption[];
  helperText?: string;
  formControlProps?: FormControlProps;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
} & SelectProps<TValue>;

function SelectInput<TValue>({
  label,
  helperText,
  options,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  ...inputProps
}: TSelectInputProps<TValue>) {
  const labelId = useId();

  return (
    <FormControl fullWidth size="small" {...(formControlProps || {})}>
      {label ? (
        <InputLabel {...inputLabelProps} htmlFor={`${label}-form-select`} id={labelId}>
          {label}
        </InputLabel>
      ) : null}
      <Select
        labelId={labelId}
        label={label}
        {...inputProps}
        slotProps={{
          ...inputProps?.slotProps,
          input: { id: `${label}-select`, ...inputProps?.slotProps?.input },
        }}
      >
        {options.map(({ value, label, menuItemProps, renderSubheader }) => {
          const itemProps = typeof menuItemProps === "function" ? menuItemProps({ value }) : menuItemProps;
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
      <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default SelectInput;
