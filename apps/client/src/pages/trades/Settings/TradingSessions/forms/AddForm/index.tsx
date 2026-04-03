import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import { addTradingSession } from '../../../../../../api/tradingSessions';
import { QueryKey } from '../../../../../../enums';
import useSnackbar from '../../../../../../hooks/useSnackbar';
import useModal from '../../../../../../hooks/useModal';
import { TradesPageModal } from '../../../../enums';
import { TradingSessionFormSchema, type TradingSessionFormSchemaType } from '../../../../../../types/tradingSessions';
import TradingSessionForm from '../FormMain';

const AddTradingSessionForm = () => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const mutation = useMutation({
    mutationFn: addTradingSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] });
      if (form.getValues('isMain')) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] });
      }
      closeModal(TradesPageModal.ADD_TRADING_SESSION);
      openSnackbar({ severity: 'success', message: 'Your trading session details have been saved.' });
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your session.' });
    },
  });

  const form = useForm<TradingSessionFormSchemaType>({
    resolver: standardSchemaResolver(TradingSessionFormSchema),
    defaultValues: { title: '', description: '', isMain: false },
  });

  const onSubmit = (data: TradingSessionFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <TradingSessionForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default AddTradingSessionForm;
