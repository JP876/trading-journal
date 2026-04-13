import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EditTradeFormSchema, type EditTradeFormSchemaType, type Trade } from '../../../../types/trade';
import TradeForm from '../TradeForm';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import { editTrade } from '../../../../api/trades';
import type { TradingSessionsResult } from '../../../../types/tradingSessions';
import { TradesPageModal } from '../../enums';
import { QueryKey } from '../../../../enums';

type EditTradeFormProps = {
  trade: Trade;
};

const EditTradeForm = ({ trade }: EditTradeFormProps) => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const sessions = queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]);
  const mainSession = sessions?.results?.find((el) => el?.isMain);

  const mutation = useMutation({
    mutationFn: (data: EditTradeFormSchemaType) => {
      const session = trade?.tradingSession || mainSession?.id;
      if (!session) {
        throw new Error('Main trading session not found');
      }
      return editTrade(trade.id, { ...data, tradingSessionId: session });
    },
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] })]);
      openSnackbar({ severity: 'success', message: 'Your trade details have been updated.' });
      closeModal(TradesPageModal.EDIT_TRADE);
    },
  });

  const form = useForm<EditTradeFormSchemaType>({
    resolver: standardSchemaResolver(EditTradeFormSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      ...trade,
      openDate: trade?.openDate ? new Date(trade.openDate) : undefined,
      closeDate: trade?.closeDate ? new Date(trade.closeDate) : undefined,
      pairId: trade?.pair,
      closedAt: trade?.closedAt || undefined,
      entryPrice: trade?.entryPrice || undefined,
      tags: trade?.tags || [],
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
