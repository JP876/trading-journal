import HistoryIcon from "@mui/icons-material/History";
import IconButton from "@mui/material/IconButton";
import { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Provider, useAtom, useAtomValue, useSetAtom } from "jotai";
import { memo } from "react";

import SelectInput, { type TSelectInputOption } from "../../../../components/inputs/SelectInput";
import useEventListeners from "../../../../hooks/useEventListeners";
import { increasingRange } from "../../../../lib/utils";
import { RESET_WIDGETS_EVENT } from "../../hooks/useResetWidgets";
import WidgetContainer, { widgetContainerErrorAtom, type TWidgetContainerProps } from "../WidgetContainer";
import { handlePreviousPeriodAtom, periodsAtom, periodsCountAtom, resetStoreAtom } from "./atoms";
import TradeDurationsChart from "./TradeDurationsChart";

const options: TSelectInputOption[] = increasingRange(10, 20, 2).map((value) => ({ value, label: value.toString() }));

const ResetButtonMain = memo(({ disabled }: { disabled: boolean }) => {
  const handlePreviousPeriod = useSetAtom(handlePreviousPeriodAtom);

  return (
    <Tooltip arrow title={disabled ? "" : "Back"} disableInteractive>
      <span>
        <IconButton size="small" disabled={disabled} onClick={handlePreviousPeriod}>
          <HistoryIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
});

const ResetButton = () => {
  const period = useAtomValue(periodsAtom);
  const renderErrors = useAtomValue(widgetContainerErrorAtom);

  return <ResetButtonMain disabled={!period || renderErrors.children} />;
};

const PeriodSelect = () => {
  const [periodCount, setPeriodCount] = useAtom(periodsCountAtom);
  const renderErrors = useAtomValue(widgetContainerErrorAtom);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const nextValue = event.target.value as string;
    setPeriodCount(nextValue);
  };

  return (
    <SelectInput
      label="Period count"
      value={periodCount}
      onChange={handleChange}
      disabled={renderErrors.children}
      options={options}
      formControlProps={{ sx: { width: "clamp(6rem, 8vw, 8rem)" } }}
    />
  );
};

type TTradeDurationsProps = {
  paperProps?: TWidgetContainerProps["paperProps"];
};

const TradeDurationsMain = ({ paperProps }: TTradeDurationsProps) => {
  const resetStore = useSetAtom(resetStoreAtom);

  useEventListeners([[RESET_WIDGETS_EVENT, resetStore]]);

  return (
    <WidgetContainer
      title="Trade durations"
      description="Your quickest profit. This is the ideal duration for your winning strategy."
      paperProps={paperProps}
      renderActions={() => (
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
          <ResetButton />
          <PeriodSelect />
        </Stack>
      )}
    >
      <TradeDurationsChart />
    </WidgetContainer>
  );
};

const TradeDurations = (props: TTradeDurationsProps) => {
  return (
    <Provider>
      <TradeDurationsMain {...props} />
    </Provider>
  );
};

export default TradeDurations;
