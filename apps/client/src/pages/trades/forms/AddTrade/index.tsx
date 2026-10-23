import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { addTrade } from '../../../../api/trades';
import { QueryKey } from '../../../../enums';
import useMainSession from '../../../../hooks/useMainSession';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import { TradeFormSchema, type TradeFormSchemaType } from '../../../../types/trade';
import { TradesPageModal } from '../../enums';
import TradeForm from '../TradeForm';

const AddTradeForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const [mainSession] = useMainSession();

  const mutation = useMutation({
    mutationFn: addTrade,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.STATS] }),
      ]);
      openSnackbar({ severity: 'success', message: 'Your trade details have been saved.' });
      closeModal(TradesPageModal.ADD_TRADE);
    },
  });

  const form = useForm<TradeFormSchemaType>({
    resolver: standardSchemaResolver(TradeFormSchema),
    defaultValues: {
      orderType: 'market_order',
      closedBy: 'tp/sl',
      pairId: mainSession?.defaultPair || undefined,
      openDate: mainSession?.defaultOpenDate ? new Date(mainSession.defaultOpenDate) : undefined,
      takeProfit: mainSession?.defaultTakeProfit,
      stopLoss: mainSession?.defaultStopLoss,
      positionSize: 10_000,
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
