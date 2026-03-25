import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import { TradeFormSchema, type TradeFormSchemaType } from '../../../../types/trade';
import type { TradingSession } from '../../../../types/tradingSessions';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import TradeForm from '../TradeForm';
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
      closeModal('addTradeForm');
    },
  });

  const form = useForm<TradeFormSchemaType>({
    resolver: standardSchemaResolver(TradeFormSchema),
    defaultValues: {
      orderType: 'market_order',
      closedBy: 'tp/sl',
    },
  });

  const onSubmit = (data: TradeFormSchemaType) => {
    if (!mainSession) {
      console.warn('Main trading session not found');
      return;
    }

    const formData = { ...data };

    if (!(formData?.openDate instanceof Date)) delete formData.openDate;
    if (!(formData?.closeDate instanceof Date)) delete formData.closeDate;
    if (!formData?.closedAt) delete formData.closedAt;

    mutation.mutate({ ...formData, tradingSessionId: mainSession.id });
  };

  return <TradeForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default AddTradeForm;
