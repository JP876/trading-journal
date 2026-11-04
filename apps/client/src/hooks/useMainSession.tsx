import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getTradingSessions } from '../api/tradingSessions';
import { QueryKey } from '../enums';

const useMainSession = () => {
  const sessionsQuery = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS],
    queryFn: () => getTradingSessions(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  const mainSession = sessionsQuery.data?.results?.find((el) => el?.isMain);

  return useMemo(() => [mainSession], [mainSession?.id]);
};

export default useMainSession;
