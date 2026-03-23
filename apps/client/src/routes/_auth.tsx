import { useEffect } from 'react';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { getLoggedInUser, refreshToken } from '../api/auth';
import { userAtom } from '../atoms/user';
import NavigationMain from '../components/Navigation';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
});

function RouteComponent() {
  const setUser = useSetAtom(userAtom);

  const refreshTokenQuery = useQuery({
    queryKey: ['refresh-token'],
    queryFn: refreshToken,
    retry: false,
    refetchInterval: 9 * 60 * 1_000,
    refetchIntervalInBackground: true,
  });

  const userDataQuery = useQuery({
    queryKey: ['user'],
    queryFn: getLoggedInUser,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!refreshTokenQuery.data?.id,
  });

  useEffect(() => {
    if (userDataQuery.data?.id) {
      setUser(userDataQuery.data);
    }
  }, [userDataQuery.data?.id]);

  if (refreshTokenQuery.error || userDataQuery.error) {
    return <Navigate to="/login" />;
  }

  return <NavigationMain />;
}
