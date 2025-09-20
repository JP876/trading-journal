import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getAccounts } from '@/api/accounts';

const useMainAccount = () => {
  const { data, isLoading } = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });

  return useMemo(() => {
    if (isLoading) return null;
    return (data || []).find((el) => el?.isMain);
  }, [isLoading, data]);
};

export default useMainAccount;
