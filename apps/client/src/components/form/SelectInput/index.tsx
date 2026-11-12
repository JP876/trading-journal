import { type SelectChangeEvent, type SelectProps } from "@mui/material/Select";
import { type ControllerFieldState, type FieldValues, type UseFormStateReturn } from "react-hook-form";

import type { FormField } from "../../../types";
import type { TSelectInputOption } from "../../inputs/SelectInput";

import SelectInput from "../../inputs/SelectInput";

type TSelectFormInputProps<TValue = any> = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  options: TSelectInputOption[];
  label: string;
  renderChips?: boolean;
  inputProps?: SelectProps<TValue>;
  helperText?: string;
  maxTags?: number;
  addAllOption?: boolean;
};

function SelectFormInput<TValue extends string | number | string[] | number[]>({
  field,
  fieldState,
  options,
  renderChips,
  label,
  inputProps,
  helperText,
  maxTags,
}: TSelectFormInputProps<TValue>) {
  const { value, name, onChange, ...restField } = field;
  const selectValue = inputProps?.multiple ? value || [] : value || "";

  const handleChange = (event: SelectChangeEvent<TValue>) => {
    if (!inputProps?.multiple) {
      onChange(event.target.value);
      return;
    }

    if (!Array.isArray(event.target.value)) {
      console.warn("Select target value is not an array");
      return;
    }
    const nextValue = event.target.value;
    onChange(nextValue);
  };

  return (
    <SelectInput
      label={label}
      renderChips={renderChips}
      maxTags={maxTags}
      options={options}
      {...inputProps}
      value={selectValue}
      onChange={handleChange}
      {...restField}
      MenuProps={{
        ...(inputProps?.MenuProps || {}),
        sx: { maxHeight: "clamp(20rem, 40vw, 28rem)", ...(inputProps?.MenuProps?.sx || {}) },
      }}
      formControlProps={{ error: !!fieldState.error, fullWidth: true }}
      helperText={!!fieldState.error ? fieldState.error.message : helperText || " "}
    />
  );
}

export default SelectFormInput;
