import { useEffect, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router';

import { refreshToken } from '../api/auth';
import { getPairs } from '../api/pairs';
import { QueryKey } from '../enums';
import useSnackbar from '../hooks/useSnackbar';
import useLogout from '../hooks/useLogout';
import { AUTH_EVENT_TYPE, type authDetailType } from '../lib/authEvent';
import { getCurrentUser } from '../lib/db';

const REFETCH_INTERVAL = 9 * 60 * 1_000;
const refreshTokenQueryOptions = queryOptions({
  queryKey: [QueryKey.REFRESH_TOKEN],
  queryFn: refreshToken,
  retry: false,
});

const ProtectedRoutes = () => {
  const [enabled, setEnabled] = useState(false);

  const { openSnackbar } = useSnackbar();
  const [logout] = useLogout();

  useQuery({ queryKey: [QueryKey.PAIRS], queryFn: getPairs, staleTime: Infinity });
  useQuery({
    ...refreshTokenQueryOptions,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    enabled: enabled,
  });

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user || !user.isLoggedIn) {
        setTimeout(() => setEnabled(true), REFETCH_INTERVAL);
      }
    })();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const handleEvent = (event: CustomEventInit<authDetailType>) => {
      if (event.detail && !event.detail.isAuthenticated) {
        logout(event.detail?.prevLocation);
        openSnackbar({ severity: 'error', message: "Looks like you're not logged in. Please sign in." });
      }
    };

    document.addEventListener(AUTH_EVENT_TYPE, handleEvent, { signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [logout]);

  return <Outlet />;
};

export default ProtectedRoutes;
