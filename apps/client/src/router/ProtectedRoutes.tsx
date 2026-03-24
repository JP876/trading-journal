import { useEffect, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';

import { refreshToken } from '../api/auth';
import { getPairs } from '../api/pairs';

const REFETCH_INTERVAL = 9 * 60 * 1_000;
const refreshTokenQueryOptions = queryOptions({
  queryKey: ['refresh-token'],
  queryFn: refreshToken,
  retry: false,
});

const ProtectedRoutes = () => {
  const [enabled, setEnabled] = useState(false);

  useQuery({ queryKey: ['pairs'], queryFn: getPairs, staleTime: Infinity });
  useQuery({
    ...refreshTokenQueryOptions,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    enabled: enabled,
  });

  useEffect(() => {
    setTimeout(() => setEnabled(true), REFETCH_INTERVAL);
  }, []);

  return <Outlet />;
};

export default ProtectedRoutes;
