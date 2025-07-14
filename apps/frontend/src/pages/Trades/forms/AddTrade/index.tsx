import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import { addTrade } from '@/api/trades';
import useAppStore from '@/store';
import { tradeFormSchema, TradeFormSchemaType } from '@/types/trades';
import TradeForm from '../TradeForm';

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
      takeProfit: userSettings?.defaultTakeProfit,
      stopLoss: userSettings?.defaultStopLoss,
    },
  });

  const onSubmit = (data: TradeFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <TradeForm onSubmit={onSubmit} form={form} isLoading={mutation.isPending} />;
};

export default AddTradeForm;
