import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { editTradingSession } from '../../../../../../api/tradingSessions';
import { QueryKey } from '../../../../../../enums';
import useModal from '../../../../../../hooks/useModal';
import useModalData from '../../../../../../hooks/useModalData';
import useSnackbar from '../../../../../../hooks/useSnackbar';
import {
  TradingSessionFormSchema,
  type TradingSession,
  type TradingSessionFormSchemaType,
} from '../../../../../../types/tradingSessions';
import { TradesPageModal } from '../../../../enums';
import TradingSessionForm from '../FormMain';

const EditTradingSessionForm = () => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const session = useModalData<TradingSession>(TradesPageModal.EDIT_TRADING_SESSION);

  const mutation = useMutation({
    mutationFn: (data: TradingSessionFormSchemaType) => {
      if (!session) {
        throw new Error(`Session details not found: ${session}`);
      }
      return editTradingSession(session!.id, data);
    },
    onSuccess: async () => {
      if (!session) {
        throw new Error(`Session details not found: ${session}`);
      }
      await queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] });
      if (form.getValues('isMain') !== !!session!.isMain) {
        await queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] });
      }
      closeModal(TradesPageModal.EDIT_TRADING_SESSION);
      openSnackbar({ severity: 'success', message: 'Your trading session details have been saved.' });
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your session.' });
    },
  });

  const form = useForm<TradingSessionFormSchemaType>({
    resolver: standardSchemaResolver(TradingSessionFormSchema),
    defaultValues: {
      ...session,
      isMain: !!session?.isMain,
      defaultPairId: session?.defaultPair || undefined,
      defaultOpenDate: session?.defaultOpenDate ? new Date(session.defaultOpenDate) : undefined,
      defaultStopLoss: session?.defaultStopLoss || undefined,
      defaultTakeProfit: session?.defaultTakeProfit || undefined,
    },
  });

  const onSubmit = (data: TradingSessionFormSchemaType) => {
    if (!session?.id) {
      console.error(`Session details not found: ${session}`);
      return;
    }
    mutation.mutate({ ...data });
  };

  return <TradingSessionForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default EditTradingSessionForm;
