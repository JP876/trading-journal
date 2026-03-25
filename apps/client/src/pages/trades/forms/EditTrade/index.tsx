import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EditTradeFormSchema, type EditTradeFormSchemaType, type Trade } from '../../../../types/trade';
import TradeForm from '../TradeForm';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import { editTrade } from '../../../../api/trades';
import type { TradingSession } from '../../../../types/tradingSessions';

type EditTradeFormProps = {
  trade: Trade;
};

const EditTradeForm = ({ trade }: EditTradeFormProps) => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const sessions = queryClient.getQueryData<TradingSession[]>(['trading-sessions']);
  const mainSession = sessions?.find((el) => el?.isMain);

  const mutation = useMutation({
    mutationFn: (data: EditTradeFormSchemaType) => {
      const session = trade?.tradingSession?.id || mainSession?.id;
      if (!session) {
        throw new Error('Main trading session not found');
      }
      return editTrade(trade.id, { ...data, tradingSessionId: session });
    },
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['trades'] })]);
      openSnackbar({ severity: 'success', message: 'Your trade details have been updated.' });
      closeModal('editTrade');
    },
  });

  const form = useForm<EditTradeFormSchemaType>({
    resolver: standardSchemaResolver(EditTradeFormSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      ...trade,
      openDate: trade?.openDate ? new Date(trade.openDate) : undefined,
      closeDate: trade?.closeDate ? new Date(trade.closeDate) : undefined,
      pairId: trade?.pair?.id,
      closedAt: trade?.closedAt || undefined,
      entryPrice: trade?.entryPrice || undefined,
    },
  });

  const onSubmit = (data: EditTradeFormSchemaType) => {
    const formData = { ...data };

    if (!(formData?.openDate instanceof Date)) delete formData.openDate;
    if (!(formData?.closeDate instanceof Date)) delete formData.closeDate;

    mutation.mutate(formData);
  };

  return <TradeForm onSubmit={onSubmit} form={form} isLoading={mutation.isPending} />;
};

export default EditTradeForm;
