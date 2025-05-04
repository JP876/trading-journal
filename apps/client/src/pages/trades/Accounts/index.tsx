import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import useAppStore from '@/store';
import { getAccounts, updateAccount } from '@/api/accounts';
import { AccountDialogListIds } from './types';

const AccountSelect = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });

  const mutation = useMutation({
    mutationFn: (id: string) => updateAccount(id, { isMain: true }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['trades'] }),
      ]);
    },
  });

  const mainAccount = (data || []).find((el) => el?.isMain);

  return (
    <Select value={mainAccount?._id} onValueChange={(value) => mutation.mutate(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Account" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((el) => (
          <SelectItem key={el?._id} value={el?._id}>
            {el?.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const AccountsMain = () => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <div className="flex justify-between items-center">
      <div>
        <h5 className=" font-bold text-2xl">Trades</h5>
      </div>
      <div className="flex items-center gap-4">
        <AccountSelect />
        <Button variant="default" size="sm" onClick={() => openModal({ id: AccountDialogListIds.ADD_ACCOUNT })}>
          <Plus /> Add Account
        </Button>
      </div>
    </div>
  );
};

export default AccountsMain;
