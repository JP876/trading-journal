import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type UseFormReturn } from 'react-hook-form';

import FormMain from '../../../../components/form/FormMain';
import { QueryKey } from '../../../../enums';
import useMainSession from '../../../../hooks/useMainSession';
import useModal from '../../../../hooks/useModal';
import useSnackbar from '../../../../hooks/useSnackbar';
import { ADD_RANDOM_TRADES_OPTIONS, addRandomTradesDB } from '../../../../lib/db/api/trades/addRandomTradesDB';
import { AddRandomTradesFormSchema, type AddRandomTradesFormType } from '../../../../types/trade';
import { TradesPageModal } from '../../enums';
import { getCurrentUser } from '../../../../lib/utils';

type TAddRandomTradesContainerProps = {
  children: (options: { form: UseFormReturn<AddRandomTradesFormType>; isLoading: boolean }) => React.ReactElement;
  onSuccess?: () => void;
};

const AddRandomTradesContainer = ({ onSuccess, children }: TAddRandomTradesContainerProps) => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();
  const [mainSession] = useMainSession();

  const mutation = useMutation({
    mutationFn: addRandomTradesDB,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.STATS] }),
      ]);
      openSnackbar({ severity: 'success', message: 'Your trades details have been saved.' });
      closeModal(TradesPageModal.ADD_RANDOM_TRADES);
      if (onSuccess) onSuccess();
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: "Random trades couldn't be created. Try again in a moment." });
    },
  });

  const form = useForm<AddRandomTradesFormType>({
    resolver: standardSchemaResolver(AddRandomTradesFormSchema),
    defaultValues: ADD_RANDOM_TRADES_OPTIONS,
  });

  const onSubmit = (data: AddRandomTradesFormType) => {
    if (!mainSession) {
      console.warn('Main trading session not found');
      return;
    }

    const user = getCurrentUser();
    if (!user) return;

    mutation.mutate({ user: user.id, tradingSessionId: mainSession.id, ...data });
  };

  return (
    <FormMain<AddRandomTradesFormType> onSubmit={onSubmit} form={form}>
      {children({ form, isLoading: mutation.isPending })}
    </FormMain>
  );
};

export default AddRandomTradesContainer;
