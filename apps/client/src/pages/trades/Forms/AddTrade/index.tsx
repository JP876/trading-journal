import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TradeDialogListIds, tradeFormSchema, TradeFormSchemaType } from '../../types';
import useAppStore from '@/store';
import { addTrade } from '@/api/trades';
import TradeFrom from '../TradeFrom';

const AddTradeForm = () => {
  const queryClient = useQueryClient();

  const closeModal = useAppStore((state) => state.closeModal);
  const userSettings = useAppStore((state) => state.user?.userSettings);

  const mutation = useMutation({
    mutationFn: addTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      closeModal(TradeDialogListIds.ADD_TRADE);
      toast.success('The trade has been added successfully.');
    },
  });

  const form = useForm<TradeFormSchemaType>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      openDate: undefined,
      closeDate: undefined,
      direction: undefined,
      pair: undefined,
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

  return <TradeFrom form={form} onSubmit={onSubmit} loading={mutation.isPending} />;
};

export default AddTradeForm;
