import type { SelectChangeEvent } from "@mui/material";
import type { ColumnVisibilityState } from "@tanstack/react-table";

import { useAtom, useAtomValue, type SetStateAction, type Store, type WritableAtom } from "jotai";
import { memo, type CSSProperties } from "react";

import SelectInput, { type TSelectInputOption } from "../inputs/SelectInput";
import { tableColumnVisibilityAtom, tableInfoAtom, type TTableInfo } from "./atoms";

type TColumnVisibilitySelectProps = {
  options: TSelectInputOption[];
  width?: CSSProperties["width"];
  anAtom?: WritableAtom<ColumnVisibilityState, [SetStateAction<ColumnVisibilityState>], void>;
  store?: Store;
};

const ColumnVisibilitySelect = ({ anAtom, options, width, store }: TColumnVisibilitySelectProps) => {
  const [visibility, setVisibility] = useAtom(anAtom || tableColumnVisibilityAtom, { store });
  const tableInfo = useAtomValue<TTableInfo>(tableInfoAtom, { store });

  const selectOptions = (() => {
    if (!tableInfo.visibility) return null;
    return options.filter((option) => (tableInfo.visibility || []).find((el) => el.id === option.value));
  })();

  const value: string[] = Object.keys(visibility).reduce<string[]>((acc, key) => {
    return visibility[key] ? [...acc, key] : acc;
  }, []);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    if (!Array.isArray(value) || !tableInfo.visibility) {
      return;
    }

    const nextValue: Record<string, boolean> = {};
    for (let { id } of tableInfo.visibility) {
      nextValue[id] = value.includes(id);
    }
    setVisibility(nextValue);
  };

  if (!selectOptions) {
    return null;
  }

  return (
    <SelectInput
      label="Column visibility"
      value={value}
      onChange={handleChange}
      multiple
      renderChips
      options={selectOptions}
      formControlProps={{ sx: { width: width || "clamp(10rem, 20vw, 15rem)" } }}
    />
  );
};

export default memo(ColumnVisibilitySelect);
