import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { minutesToHours } from 'date-fns';
import DateTimeInput from '../../../../components/form/DateTimeInput';
import FormMain from '../../../../components/form/FormMain';
import SelectInput from '../../../../components/form/SelectInput';
import SliderInput from '../../../../components/form/SliderInput';
import SubmitButton from '../../../../components/form/SubmitButton';
import TextInput from '../../../../components/form/TextInput';
import { QueryKey } from '../../../../enums';
import useMainSession from '../../../../hooks/useMainSession';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import { ADD_RANDOM_TRADES_OPTIONS, addRandomTradesDB } from '../../../../lib/db/api/trades';
import { AddRandomTradesFormSchema, type AddRandomTradesFormType } from '../../../../types/trade';
import { TradesPageModal } from '../../enums';
import usePairsOptions from '../../hooks/usePairsOptions';
import CloseDateInput from '../CloseDateInput';

const getMarks = (length: number = 200, step: number = 20) => {
  return Array.from({ length: length / 10 }).map((_, i) => ({ value: i * step, label: i * step }));
};

const AddRandomTradesForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();
  const [mainSession] = useMainSession();

  const pairsOptions = usePairsOptions();

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

      <Controller
        name="stopLoss"
        control={form.control}
        render={(props) => (
          <SliderInput
            label="Stop Loss"
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
            label="Take Profit"
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
            inputProps={{
              min: 1,
              max: 12 * 60,
              marks: [
                { value: 1, label: 1 },
                ...getMarks(12 * 60, 60).map((el) => ({
                  ...el,
                  label: `${minutesToHours(el.value)}h`,
                })),
              ],
            }}
            {...props}
          />
        )}
      />

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
