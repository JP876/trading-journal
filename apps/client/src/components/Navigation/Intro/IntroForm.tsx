import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Stack from "@mui/material/Stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";

import { QueryKey } from "../../../enums";
import useModal from "../../../hooks/useModal";
import useSnackbar from "../../../hooks/useSnackbar";
import { ADD_RANDOM_TRADES_OPTIONS, addRandomTradesDB } from "../../../lib/db/api/trades/addRandomTradesDB";
import { editTradingSessionDB, findMainTradingSession } from "../../../lib/db/api/tradingSessions";
import { getCurrentUser } from "../../../lib/utils";
import { TradesPageModal } from "../../../pages/trades/enums";
import CloseDateInput from "../../../pages/trades/forms/CloseDateInput";
import usePairsOptions from "../../../pages/trades/hooks/usePairsOptions";
import { AddRandomTradesFormSchema, type AddRandomTradesFormType } from "../../../types/trade";
import { TradingSessionFormSchema, type TradingSessionFormSchemaType } from "../../../types/tradingSessions";
import CloseModalButton from "../../form/CloseModalButton";
import DateTimeInput from "../../form/DateTimeInput";
import FormMain from "../../form/FormMain";
import SelectFormInput from "../../form/SelectInput";
import SubmitButton from "../../form/SubmitButton";
import TextInput from "../../form/TextInput";

type TIntroForm = AddRandomTradesFormType & TradingSessionFormSchemaType;

const IntroFormSchema = AddRandomTradesFormSchema.extend(TradingSessionFormSchema.shape);

const addIntroDataDB = async (data: TIntroForm) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error(`User info not found`);
  }

  let mainSession = await findMainTradingSession(user.id);
  if (!mainSession) {
    throw new Error(`Main session not found`);
  }

  await editTradingSessionDB(mainSession.id, data);
  return await addRandomTradesDB({ ...data, tradingSessionId: mainSession.id, user: user.id });
};

const DEFAULT_VALUES: TIntroForm = {
  ...ADD_RANDOM_TRADES_OPTIONS,
  accountSize: 50_000,
  title: `Initial session ${format(new Date(), "MM/yy")}`,
  isMain: true,
};

const IntroForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const pairsOptions = usePairsOptions();

  const mutation = useMutation({
    mutationFn: addIntroDataDB,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.STATS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
      ]);
      openSnackbar({
        severity: "success",
        message: "Done! Your sample trades are ready to view.",
      });
      closeModal(TradesPageModal.INTRO);
    },
  });

  const form = useForm<TIntroForm>({
    resolver: standardSchemaResolver(IntroFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  return (
    <FormMain<TIntroForm> onSubmit={mutation.mutate} form={form}>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Controller
          name="title"
          control={form.control}
          render={(props) => <TextInput label="Title *" inputProps={{ sx: { flex: "0 0 66%" } }} {...props} />}
        />
        <Controller
          name="accountSize"
          control={form.control}
          render={(props) => <TextInput label="Account size" {...props} inputProps={{ type: "number" }} />}
        />
      </Stack>
      <Controller
        name="pairs"
        control={form.control}
        render={(props) => (
          <SelectFormInput
            {...props}
            options={pairsOptions}
            label="Pairs"
            renderChips
            maxTags={6}
            inputProps={{ multiple: true, disabled: !pairsOptions.length }}
          />
        )}
      />
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Controller
          name="count"
          control={form.control}
          render={(props) => <TextInput label="Count" {...props} inputProps={{ type: "number" }} />}
        />
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
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2, justifyContent: "flex-end" }}>
        <CloseModalButton modalId={TradesPageModal.INTRO} />
        <SubmitButton loading={mutation.isPending} />
      </Stack>
    </FormMain>
  );
};

export default IntroForm;
