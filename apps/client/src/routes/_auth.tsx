import { useEffect, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { getLoggedInUser, refreshToken } from '../api/auth';
import { userAtom } from '../atoms/user';
import NavigationMain from '../components/Navigation';
import withCatch from '../lib/withCatch';

const REFETCH_INTERVAL = 9 * 60 * 1_000;
const refreshTokenQueryOptions = queryOptions({
  queryKey: ['refresh-token'],
  queryFn: refreshToken,
  retry: false,
});

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const [error] = await withCatch(queryClient.ensureQueryData(refreshTokenQueryOptions));
    if (error) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
});

function RouteComponent() {
  const setUser = useSetAtom(userAtom);
  const [enabled, setEnabled] = useState(false);

  const refreshTokenQuery = useQuery({
    ...refreshTokenQueryOptions,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    enabled: enabled,
  });

  const userDataQuery = useQuery({
    queryKey: ['user'],
    queryFn: getLoggedInUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userDataQuery.data?.id && refreshTokenQuery.data?.id) {
      setUser(userDataQuery.data);
    }
  }, [userDataQuery.data?.id]);

  useEffect(() => {
    setTimeout(() => setEnabled(true), REFETCH_INTERVAL);
  }, []);

  return <NavigationMain />;
}
