import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import useAppStore from '@/store';
import { addAccount } from '@/api/accounts';
import { accountFormSchema, AccountFormSchemaType } from '@/types/accounts';
import AccountForm from '../AccountForm';

const AddAccountForm = () => {
  const queryClient = useQueryClient();
  const closeModal = useAppStore((state) => state.closeModal);

  const mutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      closeModal('addAccount');
    },
  });

  const form = useForm<AccountFormSchemaType>({
    resolver: standardSchemaResolver(accountFormSchema),
    defaultValues: { title: '', description: '', isMain: false },
  });

  const onSubmit = (data: AccountFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <AccountForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default AddAccountForm;
