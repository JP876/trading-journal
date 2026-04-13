import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';

const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryClient = useQueryClient();

  const logout = useCallback(
    (prevLocation?: string) => {
      navigate('/', {
        replace: true,
        viewTransition: true,
        state: { prevLocation: prevLocation || location.pathname },
      });
      queryClient.clear();
    },
    [location.pathname, navigate, queryClient]
  );

  return [logout] as const;
};

export default useLogout;
