import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import { editTradingSession } from '../../../../../../api/tradingSessions';
import {
  TradingSessionFormSchema,
  type TradingSession,
  type TradingSessionFormSchemaType,
} from '../../../../../../types/tradingSessions';
import TradingSessionForm from '../FormMain';
import useModal from '../../../../../../hooks/useModal';
import { QueryKey } from '../../../../../../enums';
import { TradesPageModal } from '../../../../enums';
import useSnackbar from '../../../../../../hooks/useSnackbar';

type EditTradingSessionFormProps = {
  session: TradingSession;
};

const EditTradingSessionForm = ({ session }: EditTradingSessionFormProps) => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: (data: TradingSessionFormSchemaType) => editTradingSession(session.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] });
      if (form.getValues('isMain') !== !!session.isMain) {
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
    mutation.mutate({ ...data });
  };

  return <TradingSessionForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default EditTradingSessionForm;
