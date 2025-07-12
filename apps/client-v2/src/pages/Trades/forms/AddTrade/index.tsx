import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, Box, Button, Divider, Stack, TextField } from '@mui/material';
import { DateTimePicker, renderTimeViewClock } from '@mui/x-date-pickers';
import CheckIcon from '@mui/icons-material/Check';

import { addTrade } from '@/api/trades';
import useAppStore from '@/store';
import { tradeFormSchema, TradeFormSchemaType } from '@/types/trades';
import { directionItems, pairOptions, resultItems } from '../consts';
import SelectInput from '@/components/formInputs/SelectInput';
import { selectOptionType } from '@/types';

const AddTradeForm = () => {
  const queryClient = useQueryClient();

  const closeModal = useAppStore((state) => state.closeModal);
  const userSettings = useAppStore((state) => state.user?.userSettings);

  const mutation = useMutation({
    mutationFn: addTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      closeModal('addTrade');
    },
  });

  const form = useForm<TradeFormSchemaType>({
    resolver: standardSchemaResolver(tradeFormSchema),
    defaultValues: {
      openDate: undefined,
      closeDate: undefined,
      direction: undefined,
      pair: '',
      pl: undefined,
      comment: '',
      takeProfit: userSettings?.defaultTakeProfit,
      stopLoss: userSettings?.defaultStopLoss,
      files: [],
    },
  });

  const onSubmit = (data: TradeFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return (
    <Box
      component="form"
      sx={{ width: '36rem', display: 'flex', flexDirection: 'column', gap: 3 }}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="pair"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              fullWidth
              options={pairOptions}
              renderInput={(params) => (
                <TextField inputRef={field.ref} error={!!error?.message} {...params} size="small" label="Pair *" />
              )}
              value={field.value ? pairOptions.find((option) => option.id === field.value) : null}
              onChange={(_: any, newValue: selectOptionType | null) => {
                field.onChange(newValue?.id);
              }}
            />
          )}
        />
        <Controller
          name="direction"
          control={form.control}
          render={({ field }) => (
            <SelectInput
              options={directionItems}
              label="Direction *"
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          )}
        />
        <Controller
          name="result"
          control={form.control}
          render={({ field }) => (
            <SelectInput
              options={resultItems}
              label="Result *"
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
            />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="stopLoss"
          control={form.control}
          render={({ field }) => (
            <TextField
              size="small"
              type="number"
              label="Stop Loss *"
              {...field}
              onChange={(e) => field.onChange(+e.target.value)}
            />
          )}
        />
        <Controller
          name="takeProfit"
          control={form.control}
          render={({ field }) => (
            <TextField
              size="small"
              type="number"
              label="Take Profit *"
              {...field}
              onChange={(e) => field.onChange(+e.target.value)}
            />
          )}
        />
        <Controller
          name="pl"
          control={form.control}
          render={({ field }) => <TextField size="small" type="number" label="Profit/Loss" {...field} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="openDate"
          control={form.control}
          render={({ field }) => (
            <DateTimePicker
              views={['year', 'month', 'day', 'hours', 'minutes']}
              format="dd/MM/yyyy HH:mm"
              label="Open Date"
              value={field.value || null}
              onChange={(newValue) => field.onChange(newValue)}
              ampm={false}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
            />
          )}
        />
        <Controller
          name="closeDate"
          control={form.control}
          render={({ field }) => (
            <DateTimePicker
              views={['year', 'month', 'day', 'hours', 'minutes']}
              format="dd/MM/yyyy HH:mm"
              label="Open Date"
              value={field.value || null}
              onChange={(newValue) => field.onChange(newValue)}
              ampm={false}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              viewRenderers={{ hours: renderTimeViewClock, minutes: renderTimeViewClock }}
            />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center">
        <Controller
          name="comment"
          control={form.control}
          render={({ field }) => <TextField fullWidth size="small" label="Comment" rows={6} multiline {...field} />}
        />
      </Stack>

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button loading={mutation.isPending} startIcon={<CheckIcon />} size="small" variant="contained" type="submit">
          Confirm
        </Button>
      </Stack>
    </Box>
  );
};

export default AddTradeForm;
