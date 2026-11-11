import { Stack } from "@mui/material";
import { minutesToHours } from "date-fns";
import { Controller } from "react-hook-form";

import DateTimeInput from "../../../../components/form/DateTimeInput";
import SelectFormInput from "../../../../components/form/SelectInput";
import SliderInput from "../../../../components/form/SliderInput";
import SubmitButton from "../../../../components/form/SubmitButton";
import TextInput from "../../../../components/form/TextInput";
import usePairsOptions from "../../hooks/usePairsOptions";
import CloseDateInput from "../CloseDateInput";
import AddRandomTradesContainer from "./AddRandomTradesContainer";

const getMarks = (length: number = 200, step: number = 20) => {
  return Array.from({ length: length / 10 }).map((_, i) => ({ value: i * step, label: i * step }));
};

const durationMarks = [
  { value: 1, label: 1 },
  ...getMarks(12 * 60, 60).map((el) => ({ ...el, label: `${minutesToHours(el.value)}h` })),
];
const positionSizeMarks = getMarks(100_000, 10_000).map((el) => ({ ...el, label: `${el.value / 1_000}k` }));

const AddRandomTradesForm = () => {
  const pairsOptions = usePairsOptions();

  return (
    <AddRandomTradesContainer>
      {({ form, isLoading }) => (
        <>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Controller
              name="count"
              control={form.control}
              render={(props) => <TextInput label="Count" {...props} inputProps={{ type: "number" }} />}
            />
            <Controller
              name="pairs"
              control={form.control}
              render={(props) => (
                <SelectFormInput
                  {...props}
                  options={pairsOptions}
                  label="Pairs"
                  renderChips
                  inputProps={{ multiple: true, disabled: !pairsOptions.length }}
                />
              )}
            />
          </Stack>

          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Controller
              name="winPercentage"
              control={form.control}
              render={(props) => (
                <TextInput
                  label="Win Rate"
                  {...props}
                  inputProps={{ type: "number", slotProps: { input: { endAdornment: "%" } } }}
                />
              )}
            />
            <Controller
              name="longPercentage"
              control={form.control}
              render={(props) => (
                <TextInput
                  label="Direction: LONG"
                  {...props}
                  inputProps={{ type: "number", slotProps: { input: { endAdornment: "%" } } }}
                />
              )}
            />
          </Stack>

          <Controller
            name="stopLoss"
            control={form.control}
            render={(props) => (
              <SliderInput
                label="Stop Loss (pips)"
                inputProps={{ min: 1, max: 200, marks: [{ value: 1, label: 1 }, ...getMarks()] }}
                {...props}
              />
            )}
          />
          <Controller
            name="takeProfit"
            control={form.control}
            render={(props) => (
              <SliderInput
                label="Take Profit (pips)"
                inputProps={{ min: 1, max: 200, marks: [{ value: 1, label: 1 }, ...getMarks()] }}
                {...props}
              />
            )}
          />
          <Controller
            name="tradeDuration"
            control={form.control}
            render={(props) => (
              <SliderInput
                label="Trade Duration (min)"
                inputProps={{ min: 1, max: 12 * 60, marks: durationMarks }}
                {...props}
              />
            )}
          />
          <Controller
            name="positionSize"
            control={form.control}
            render={(props) => (
              <SliderInput
                label="Position size"
                inputProps={{ min: 10_000, max: 100_000, step: 1_000, marks: positionSizeMarks }}
                {...props}
              />
            )}
          />

          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Controller
              name="startDate"
              control={form.control}
              render={(props) => <DateTimeInput label="Start Date" inputProps={{ disableFuture: true }} {...props} />}
            />
            <Controller
              name="endDate"
              control={form.control}
              render={(props) => <CloseDateInput label="End Date" addHoursCount={24 * 14} {...props} />}
            />
          </Stack>

          <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
            <SubmitButton loading={isLoading} />
          </Stack>
        </>
      )}
    </AddRandomTradesContainer>
  );
};

export default AddRandomTradesForm;
