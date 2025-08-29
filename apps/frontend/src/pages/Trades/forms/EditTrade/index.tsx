import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import useAppStore from '@/store';
import { editTradeFormSchema, EditTradeFormSchemaType, TradeType } from '@/types/trades';
import { editTrade } from '@/api/trades';
import TradeForm from '../TradeForm';

type EditTradeFormProps = {
  trade: TradeType;
};

const EditTradeForm = ({ trade }: EditTradeFormProps) => {
  const queryClient = useQueryClient();

  const closeModal = useAppStore((state) => state.closeModal);
  const openToast = useAppStore((state) => state.openToast);

  const mutation = useMutation({
    mutationFn: (data: EditTradeFormSchemaType) => editTrade(trade._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      openToast({ severity: 'success', message: 'Your trade details have been updated.' });
      closeModal('editTrade');
    },
  });

  const form = useForm<EditTradeFormSchemaType>({
    resolver: standardSchemaResolver(editTradeFormSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      ...trade,
      openDate: trade?.openDate ? new Date(trade.openDate) : undefined,
      closeDate: trade?.closeDate ? new Date(trade.closeDate) : undefined,
      deleteFiles: [],
      tags: trade?.tags ? trade.tags.map((tag) => tag._id) : [],
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
