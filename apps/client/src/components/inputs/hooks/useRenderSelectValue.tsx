import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useRef } from "react";

import type { TSelectInputOption } from "../SelectInput";

import checkBrightness from "../../../lib/checkBrighness";

type TRenderSelectValueOptions = {
  multiple?: boolean;
  maxTags?: number;
  renderChips?: boolean;
};

function useRenderSelectValue<TValue extends string | number | string[] | number[]>(
  options: TSelectInputOption[],
  renderOptions: TRenderSelectValueOptions,
) {
  const renderOptionsRef = useRef(renderOptions);
  renderOptionsRef.current = renderOptions;

  const renderValue = useCallback(
    (selected: TValue) => {
      if (!renderOptionsRef.current?.multiple && !Array.isArray(selected)) {
        const value = options.find((o) => o?.value.toString() === selected.toString());
        return (
          <Typography variant="body1" sx={{ lineHeight: 1.4 }}>
            {value?.label || ""}
          </Typography>
        );
      }

      if (!Array.isArray(selected)) return null;

      const formatedSelected = selected.reduce<TSelectInputOption[]>((acc, id) => {
        const option = options.find((option) => id.toString() === option.value.toString());
        return option?.value ? [...acc, { ...option }] : acc;
      }, []);

      const rest = formatedSelected.slice(renderOptionsRef.current?.maxTags || 2).length;

      return (
        <Stack sx={{ flexWrap: "wrap", gap: 0.5, flexDirection: "row", alignItems: "center" }}>
          {formatedSelected
            .slice(0, renderOptionsRef.current?.maxTags || 2)
            .map(({ value, label, chipProps, chipBackground }) =>
              renderOptionsRef.current?.renderChips ? (
                <Chip
                  key={value}
                  label={label}
                  {...(chipProps || {})}
                  size="small"
                  sx={[
                    (theme) => ({
                      ...(typeof chipProps?.sx === "function" ? chipProps?.sx(theme) : {}),
                      height: "22px",
                      ...(chipBackground && {
                        backgroundColor: chipBackground,
                        color: checkBrightness(chipBackground) ? "white" : "black",
                      }),
                    }),
                  ]}
                />
              ) : (
                <Typography key={value} variant="body1" sx={{ lineHeight: 1.4 }}>
                  {label},
                </Typography>
              ),
            )}
          {renderOptionsRef.current?.renderChips ? (
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
    },
    [options],
  );

  return [renderValue];
}

export default useRenderSelectValue;
