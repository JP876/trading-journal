import { type ChipProps } from "@mui/material/Chip";
import FormControl, { type FormControlProps } from "@mui/material/FormControl";
import FormHelperText, { type FormHelperTextProps } from "@mui/material/FormHelperText";
import InputLabel, { type InputLabelProps } from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem, { type MenuItemProps } from "@mui/material/MenuItem";
import Select, { type SelectProps } from "@mui/material/Select";
import { useCallback, useId } from "react";

import type { SelectOption } from "../../types";

import useRenderSelectValue from "./hooks/useRenderSelectValue";

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
  maxTags?: number;
  renderChips?: boolean;
} & SelectProps<TValue>;

function SelectInput<TValue extends string | number | string[] | number[]>({
  label,
  helperText,
  options,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  maxTags,
  renderChips,
  ...inputProps
}: TSelectInputProps<TValue>) {
  const labelId = useId();

  const [renderValue] = useRenderSelectValue<TValue>(options, {
    maxTags,
    multiple: inputProps?.multiple,
    renderChips,
  });

  const renderOptions = useCallback((options: TSelectInputOption[]) => {
    return options.map(({ value, label, menuItemProps, renderSubheader }) => {
      const itemProps = typeof menuItemProps === "function" ? menuItemProps({ value }) : menuItemProps;
      if (renderSubheader) {
        return <ListSubheader key={value}>{label}</ListSubheader>;
      }
      return (
        <MenuItem key={value} {...(itemProps || {})} value={value}>
          {label}
        </MenuItem>
      );
    });
  }, []);

  return (
    <FormControl size="small" {...(formControlProps || {})}>
      {label ? (
        <InputLabel {...inputLabelProps} htmlFor={`${label}-form-select`} id={labelId}>
          {label}
        </InputLabel>
      ) : null}
      <Select
        labelId={labelId}
        label={label}
        renderValue={renderValue}
        {...inputProps}
        slotProps={{
          ...inputProps?.slotProps,
          input: { id: `${label}-select`, ...inputProps?.slotProps?.input },
        }}
      >
        {inputProps?.children || renderOptions(options)}
      </Select>
      <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default SelectInput;
