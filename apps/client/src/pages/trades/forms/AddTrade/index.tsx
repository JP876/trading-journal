import { Box, Divider, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { useAppForm } from '../../../../components/Form';
import { TradeFormSchema } from '../../../../types/trade';
import type { Pair } from '../../../../types/pair';
import type { TradingSession } from '../../../../types/tradingSessions';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';

const AddTradeForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const pairs = queryClient.getQueryData<Pair[]>(['pairs']);
  const sessions = queryClient.getQueryData<TradingSession[]>(['trading-sessions']);
  const mainSession = sessions?.find((el) => el?.isMain);

  const form = useAppForm({
    validators: {
      onSubmit: TradeFormSchema,
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
        <form.AppField name="takeProfit">
          {(field) => <field.TextField label="Take Profit" type="number" />}
        </form.AppField>
        <form.AppField name="stopLoss">{(field) => <field.TextField label="Stop Loss" type="number" />}</form.AppField>
      </Stack>
      <Divider />
      <form.AppForm>
        <form.SubscribeButton>Submit</form.SubscribeButton>
      </form.AppForm>
    </Box>
  );
};

export default AddTradeForm;
