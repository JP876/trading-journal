import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAppForm } from '../../../../components/Form';
import { TradeFormSchema } from '../../../../types/trade';
import type { TradingSession } from '../../../../types/tradingSessions';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import TradeForm from '../TradeForm';
import { defaultTradeValues } from '../consts';
import { addTrade } from '../../../../api/trades';

const AddTradeForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const sessions = queryClient.getQueryData<TradingSession[]>(['trading-sessions']);
  const mainSession = sessions?.find((el) => el?.isMain);

  const mutation = useMutation({
    mutationFn: addTrade,
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['trades'] })]);
      openSnackbar({ severity: 'success', message: 'Your trade details have been saved.' });
      closeModal('addTrade');
    },
  });

  const form = useAppForm({
    defaultValues: {},
    validators: {
      onSubmit: TradeFormSchema,
    },
    onSubmit: ({ value }) => {
      if (!mainSession) {
        return;
      }
    },
  });

  return <TradeForm form={form} />;
};

export default AddTradeForm;
