import { useEffect, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { refreshToken } from '../api/auth';
import NavigationMain from '../components/Navigation';
import withCatch from '../lib/withCatch';
import { getPairs } from '../api/pairs';

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

  return <NavigationMain />;
}
