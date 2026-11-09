import { queryOptions, useQuery } from '@tanstack/react-query';
import { getDefaultStore, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { refreshToken } from '../api/auth';
import { getPairs } from '../api/pairs';
import { pairsAtom } from '../atoms';
import { QueryKey } from '../enums';
import useLogout from '../hooks/useLogout';
import useSnackbar from '../hooks/useSnackbar';
import { AUTH_EVENT_TYPE, type authDetailType } from '../lib/authEvent';
import { isGuest } from '../lib/utils';

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

  const setPairs = useSetAtom(pairsAtom, { store: getDefaultStore() });

  const { data, isFetched } = useQuery({ queryKey: [QueryKey.PAIRS], queryFn: getPairs, staleTime: Infinity });
  useQuery({
    ...refreshTokenQueryOptions,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    enabled: enabled,
  });

  useEffect(() => {
    if (isFetched && Array.isArray(data) && data.length > 0) {
      setPairs(data);
    }
  }, [isFetched, data]);

  useEffect(() => {
    (async () => {
      if (!isGuest()) {
        setTimeout(() => setEnabled(true), REFETCH_INTERVAL);
      }
    })();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const handleEvent = (event: CustomEventInit<authDetailType>) => {
      if (event.detail && !event.detail.isAuthenticated) {
        setTimeout(() => {
          logout(event.detail?.prevLocation);
          openSnackbar({
            severity: 'error',
            message: "Looks like you're not logged in. Please sign in.",
          });
        }, 0);
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
