import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Stack } from '@mui/material';

import FormMain from '../../../../components/form/FormMain';
import SelectInput from '../../../../components/form/SelectInput';
import TextInput from '../../../../components/form/TextInput';
import { QueryKey } from '../../../../enums';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import { ADD_RANDOM_TRADES_OPTIONS, addRandomTradesDB } from '../../../../lib/db/api/trades';
import { AddRandomTradesFormSchema, type AddRandomTradesFormType } from '../../../../types/trade';
import type { TradingSessionsResult } from '../../../../types/tradingSessions';
import { TradesPageModal } from '../../enums';
import usePairsOptions from '../../hooks/usePairsOptions';
import DateTimeInput from '../../../../components/form/DateTimeInput';
import CloseDateInput from '../CloseDateInput';
import SubmitButton from '../../../../components/form/SubmitButton';
import SliderInput from '../../../../components/form/SliderInput';
import { useRef } from 'react';

const getMarks = (length: number = 200, step: number = 20) => {
  return Array.from({ length: length / 10 }).map((_, i) => ({ value: i * step, label: i * step }));
};

const AddRandomTradesForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const sessions = queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]);
  const mainSession = sessions?.results?.find((el) => el?.isMain);

  const pairsOptions = usePairsOptions();
  const marks = useRef(getMarks());

  const mutation = useMutation({
    mutationFn: addRandomTradesDB,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.STATS] }),
      ]);
      openSnackbar({ severity: 'success', message: 'Your trades details have been saved.' });
      closeModal(TradesPageModal.ADD_RANDOM_TRADES);
    },
  });

  const form = useForm<AddRandomTradesFormType>({
    resolver: standardSchemaResolver(AddRandomTradesFormSchema),
    defaultValues: ADD_RANDOM_TRADES_OPTIONS,
  });

  const onSubmit = (data: AddRandomTradesFormType) => {
    if (!mainSession) {
      console.warn('Main trading session not found');
      return;
    }
    mutation.mutate({ tradingSessionId: mainSession.id, ...data });
  };

  return (
    <FormMain<AddRandomTradesFormType> onSubmit={onSubmit} form={form}>
      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="count"
          control={form.control}
          render={(props) => <TextInput label="Count" {...props} inputProps={{ type: 'number' }} />}
        />
        <Controller
          name="pairs"
          control={form.control}
          render={(props) => (
            <SelectInput
              {...props}
              options={pairsOptions}
              label="Pairs"
              renderChips
              addAllOption
              inputProps={{ multiple: true, disabled: !pairsOptions.length }}
            />
          )}
        />
      </Stack>

      <Controller
        name="stopLoss"
        control={form.control}
        render={(props) => (
          <SliderInput label="Stop Loss" inputProps={{ min: 0, max: 200, marks: marks.current }} {...props} />
        )}
      />
      <Controller
        name="takeProfit"
        control={form.control}
        render={(props) => (
          <SliderInput label="Take Profit" inputProps={{ min: 0, max: 200, marks: marks.current }} {...props} />
        )}
      />

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="winPercentage"
          control={form.control}
          render={(props) => (
            <TextInput
              label="Win Rate"
              {...props}
              inputProps={{ type: 'number', slotProps: { input: { endAdornment: '%' } } }}
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
              inputProps={{ type: 'number', slotProps: { input: { endAdornment: '%' } } }}
            />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
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

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <SubmitButton loading={mutation.isPending} />
      </Stack>
    </FormMain>
  );
};

export default AddRandomTradesForm;
