import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useCallback(
    (prevLocation?: string) => {
      navigate('/', {
        replace: true,
        viewTransition: true,
        state: { prevLocation: prevLocation || location.pathname },
      });
    },
    [location.pathname, navigate]
  );

  return [logout] as const;
};

export default useLogout;
