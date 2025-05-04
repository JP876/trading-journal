import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import useAppStore from '@/store';
import { editTradeFormSchema, EditTradeFormSchemaType, TradeDialogListIds, TradeType } from '../../types';
import TradeFrom from '../TradeFrom';
import { editTrade } from '@/api/trades';

const EditTradeForm = ({ trade }: { trade: TradeType }) => {
  const queryClient = useQueryClient();
  const closeModal = useAppStore((state) => state.closeModal);

  const mutation = useMutation({
    mutationFn: (data: EditTradeFormSchemaType) => editTrade(trade._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      closeModal(TradeDialogListIds.EDIT_TRADE);
      toast.success('The trade has been updated successfully.');
    },
  });

  const form = useForm<EditTradeFormSchemaType>({
    resolver: zodResolver(editTradeFormSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      ...trade,
      openDate: trade?.openDate ? new Date(trade.openDate) : undefined,
      closeDate: trade?.closeDate ? new Date(trade.closeDate) : undefined,
      files: undefined,
      deleteFiles: [],
    },
  });

  const onSubmit = (data: EditTradeFormSchemaType) => {
    console.log(data);

    mutation.mutate(data);
  };

  return <TradeFrom form={form} onSubmit={onSubmit} loading={mutation.isPending} addedFiles={trade?.files} />;
};

export default EditTradeForm;
