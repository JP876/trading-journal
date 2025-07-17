import { editAccount } from '@/api/accounts';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import useAppStore from '@/store';
import { accountFormSchema, AccountFormSchemaType, AccountType } from '@/types/accounts';
import AccountForm from '../AccountForm';

type EditAccountFormProps = {
  account: AccountType;
};

const EditAccountForm = ({ account }: EditAccountFormProps) => {
  const queryClient = useQueryClient();
  const closeModal = useAppStore((state) => state.closeModal);

  const mutation = useMutation({
    mutationFn: (data: AccountFormSchemaType) => editAccount(account?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      if (form.getValues('isMain')) {
        queryClient.invalidateQueries({ queryKey: ['trades'] });
      }
      closeModal('editAccount');
    },
  });

  const form = useForm<AccountFormSchemaType>({
    resolver: standardSchemaResolver(accountFormSchema),
    defaultValues: account,
  });

  const onSubmit = (data: AccountFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <AccountForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default EditAccountForm;
