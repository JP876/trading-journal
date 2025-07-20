import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import { addTrade } from '@/api/trades';
import useAppStore from '@/store';
import { tradeFormSchema, TradeFormSchemaType } from '@/types/trades';
import TradeForm from '../TradeForm';
import { AccountType } from '@/types/accounts';

const AddTradeForm = () => {
  const queryClient = useQueryClient();

  const closeModal = useAppStore((state) => state.closeModal);
  const openToast = useAppStore((state) => state.openToast);

  const accounts = queryClient.getQueryData<AccountType[]>(['accounts']);
  const mainAccount = (accounts || []).find((el) => el?.isMain);

  const mutation = useMutation({
    mutationFn: addTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      openToast({ severity: 'success', message: 'Your trade details have been saved.' });
      closeModal('addTrade');
    },
  });

  const form = useForm<TradeFormSchemaType>({
    resolver: standardSchemaResolver(tradeFormSchema),
    defaultValues: {
      takeProfit: mainAccount?.defaultTakeProfit || 0,
      stopLoss: mainAccount?.defaultStopLoss || 0,
    },
  });

  const onSubmit = (data: TradeFormSchemaType) => {
    const formData = { ...data };

    if (!(formData?.openDate instanceof Date)) delete formData.openDate;
    if (!(formData?.closeDate instanceof Date)) delete formData.closeDate;

    mutation.mutate(formData);
  };

  return <TradeForm onSubmit={onSubmit} form={form} isLoading={mutation.isPending} />;
};

export default AddTradeForm;
