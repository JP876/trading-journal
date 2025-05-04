import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router';

import { getLoggedInUser, refreshToken } from '@/api/auth';
import ResponseInterceptor from '@/components/ResponseInterceptor';
import useAppStore from '@/store';

const ProtectedRoutes = () => {
  const setUser = useAppStore((state) => state.setUser);

  const {
    data,
    isFetching,
    isFetchedAfterMount,
    isError: isRefreshError,
  } = useQuery({
    queryKey: ['refresh-token'],
    queryFn: refreshToken,
    retry: false,
    refetchInterval: 9 * 60 * 1_000,
    refetchIntervalInBackground: true,
  });

  const {
    data: userData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getLoggedInUser,
    retry: false,
    enabled: !!data?._id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  if ((isLoading || isFetching) && !isFetchedAfterMount) {
    return null;
  }

  if (isError || isRefreshError) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Outlet />
      <ResponseInterceptor />
    </>
  );
};

export default ProtectedRoutes;
