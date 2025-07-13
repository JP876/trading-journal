import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Divider, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { addTrade } from '@/api/trades';
import useAppStore from '@/store';
import { tradeFormSchema, TradeFormSchemaType } from '@/types/trades';
import { directionItems, pairOptions, resultItems } from '../consts';
import SelectInput from '@/components/formInputs/SelectInput';
import TextInput from '@/components/formInputs/TextInput';
import DateTimeInput from '@/components/formInputs/DateTimeInput';
import AutocompleteInput from '@/components/formInputs/AutocompleteInput';

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
          render={({ field }) => <AutocompleteInput field={field} options={pairOptions} label="Pair *" />}
        />
        <Controller
          name="direction"
          control={form.control}
          render={({ field }) => <SelectInput options={directionItems} label="Direction *" field={field} />}
        />
        <Controller
          name="result"
          control={form.control}
          render={({ field }) => <SelectInput options={resultItems} label="Result *" field={field} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="stopLoss"
          control={form.control}
          render={({ field }) => <TextInput label="Stop Loss *" field={field} type="number" />}
        />
        <Controller
          name="takeProfit"
          control={form.control}
          render={({ field }) => <TextInput label="Take Profit *" field={field} type="number" />}
        />
        <Controller
          name="pl"
          control={form.control}
          render={({ field }) => <TextInput label="Profit/Loss" field={field} type="number" />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="openDate"
          control={form.control}
          render={({ field }) => <DateTimeInput label="Open Date" field={field} />}
        />
        <Controller
          name="closeDate"
          control={form.control}
          render={({ field }) => <DateTimeInput label="Close Date" field={field} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center">
        <Controller
          name="comment"
          control={form.control}
          render={({ field }) => <TextInput label="Comment" field={field} fullWidth multiline rows={6} />}
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
