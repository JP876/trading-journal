import { useEffect, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { Outlet, useNavigate } from 'react-router';

import { refreshToken } from '../api/auth';
import { getPairs } from '../api/pairs';
import { QueryKey } from '../enums';
import useSnackbar from '../hooks/useSnackbar';

const REFETCH_INTERVAL = 9 * 60 * 1_000;
const refreshTokenQueryOptions = queryOptions({
  queryKey: [QueryKey.REFRESH_TOKEN],
  queryFn: refreshToken,
  retry: false,
});

const ProtectedRoutes = () => {
  const [enabled, setEnabled] = useState(false);

  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  useQuery({ queryKey: [QueryKey.PAIRS], queryFn: getPairs, staleTime: Infinity });
  useQuery({
    ...refreshTokenQueryOptions,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    enabled: enabled,
  });

  useEffect(() => {
    const controller = new AbortController();
    setTimeout(() => setEnabled(true), REFETCH_INTERVAL);

    const handleEvent = (event: CustomEventInit<boolean>) => {
      if (!event.detail) {
        navigate('/', { replace: true, viewTransition: true });
        openSnackbar({ severity: 'error', message: "Looks like you're not logged in. Please sign in." });
      }
    };

    document.addEventListener('is-authenticated', handleEvent, { signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, []);

  return <Outlet />;
};

export default ProtectedRoutes;
