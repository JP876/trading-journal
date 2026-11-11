import Chip from "@mui/material/Chip";
import { type SelectChangeEvent, type SelectProps } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type ControllerFieldState, type FieldValues, type UseFormStateReturn } from "react-hook-form";

import type { FormField } from "../../../types";
import type { TSelectInputOption } from "../../inputs/SelectInput";

import checkBrightness from "../../../lib/checkBrighness";
import SelectInput from "../../inputs/SelectInput";

type TSelectFormInputProps = {
  field: FormField;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  options: TSelectInputOption[];
  label: string;
  renderChips?: boolean;
  inputProps?: SelectProps;
  helperText?: string;
  maxTags?: number;
  addAllOption?: boolean;
};

function SelectFormInput({
  field,
  fieldState,
  options,
  renderChips,
  label,
  inputProps,
  helperText,
  maxTags,
}: TSelectFormInputProps) {
  const { value, name, onChange, ...restField } = field;
  const selectValue = inputProps?.multiple ? value || [] : value || "";

  const handleChange = (event: SelectChangeEvent<unknown>) => {
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

  const handleRenderValue = (selected: any | any[]) => {
    if (!inputProps?.multiple) {
      const value = options.find((o) => o?.value === selected);
      return (
        <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
          {value?.label || ""}
        </Typography>
      );
    }

    if (!Array.isArray(selected)) return null;

    const formatedSelected: TSelectInputOption[] = selected.reduce((acc, id) => {
      const option = options.find((option) => id === option.value);
      return option?.value ? [...acc, { ...option }] : acc;
    }, []);

    const rest = formatedSelected.slice(maxTags || 2).length;

    return (
      <Stack sx={{ flexWrap: "wrap", gap: 0.5, flexDirection: "row", alignItems: "center" }}>
        {formatedSelected.slice(0, maxTags || 2).map(({ value, label, chipProps, chipBackground }) =>
          renderChips ? (
            <Chip
              key={value}
              label={label}
              {...(chipProps || {})}
              size="small"
              sx={(theme) => ({
                ...(typeof chipProps?.sx === "function" ? chipProps?.sx(theme) : {}),
                height: "22px",
                backgroundColor: chipBackground,
                color: checkBrightness(chipBackground) ? "white" : "black",
              })}
            />
          ) : (
            <Typography key={value} variant="body1" sx={{ lineHeight: 1.4 }}>
              {label}
            </Typography>
          ),
        )}
        {renderChips ? (
          <Chip
            sx={{ display: rest ? "inline-flex" : "none", height: "22px" }}
            size="small"
            label={`... ${rest}`}
          ></Chip>
        ) : (
          <Typography sx={{ display: rest ? "block" : "none" }}>{`... ${rest}`}</Typography>
        )}
      </Stack>
    );
  };

  return (
    <SelectInput
      label={label}
      value={selectValue}
      onChange={handleChange}
      renderValue={handleRenderValue}
      options={options}
      {...inputProps}
      {...restField}
      formControlProps={{ error: !!fieldState.error }}
      helperText={!!fieldState.error ? fieldState.error.message : helperText || " "}
    />
  );
}

export default SelectFormInput;
