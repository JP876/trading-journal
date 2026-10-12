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
import { addMultipleRandomTradesDB } from '../../../../lib/db/api/trades';
import { AddMultipleRandomTradesFormSchema, type AddMultipleRandomTradesFormType } from '../../../../types/trade';
import type { TradingSessionsResult } from '../../../../types/tradingSessions';
import { TradesPageModal } from '../../enums';
import usePairsOptions from '../../hooks/usePairsOptions';
import DateTimeInput from '../../../../components/form/DateTimeInput';
import CloseDateInput from '../CloseDateInput';
import SubmitButton from '../../../../components/form/SubmitButton';

const AddMultipleRandomTradesForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const sessions = queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]);
  const mainSession = sessions?.results?.find((el) => el?.isMain);

  const pairsOptions = usePairsOptions();

  const mutation = useMutation({
    mutationFn: addMultipleRandomTradesDB,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
      ]);
      openSnackbar({ severity: 'success', message: 'Your trades details have been saved.' });
      closeModal(TradesPageModal.ADD_MULTIPLE_RANDOM_TRADES);
    },
  });

  const form = useForm<AddMultipleRandomTradesFormType>({
    resolver: standardSchemaResolver(AddMultipleRandomTradesFormSchema),
    defaultValues: {
      count: 100,
      minTakeProfit: 10,
      maxTakeProfit: 100,
      minStopLoss: 10,
      maxStopLoss: 20,
    },
  });

  const onSubmit = (data: AddMultipleRandomTradesFormType) => {
    if (!mainSession) {
      console.warn('Main trading session not found');
      return;
    }
    mutation.mutate({ tradingSessionId: mainSession.id, ...data });
  };

  return (
    <FormMain<AddMultipleRandomTradesFormType> onSubmit={onSubmit} form={form}>
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

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="minTakeProfit"
          control={form.control}
          render={(props) => <TextInput label="Min Take Profit" {...props} inputProps={{ type: 'number' }} />}
        />
        <Controller
          name="maxTakeProfit"
          control={form.control}
          render={(props) => <TextInput label="Max Take Profit" {...props} inputProps={{ type: 'number' }} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="minStopLoss"
          control={form.control}
          render={(props) => <TextInput label="Min Stop Loss" {...props} inputProps={{ type: 'number' }} />}
        />
        <Controller
          name="maxTakeProfit"
          control={form.control}
          render={(props) => <TextInput label="Max Stop Loss" {...props} inputProps={{ type: 'number' }} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="openDate"
          control={form.control}
          render={(props) => <DateTimeInput label="Open Date" inputProps={{ disableFuture: true }} {...props} />}
        />
        <Controller
          name="closeDate"
          control={form.control}
          render={(props) => <CloseDateInput addHoursCount={24 * 14} {...props} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <SubmitButton loading={mutation.isPending} />
      </Stack>
    </FormMain>
  );
};

export default AddMultipleRandomTradesForm;
