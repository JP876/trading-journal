import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';

import { client } from '@/lib/client';

const ResponseInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    client.interceptors.response.use(undefined, (error: AxiosError) => {
      switch (error.response?.status) {
        case 401: {
          navigate('/auth', { replace: true });
          return;
        }
        default: {
          return Promise.reject(error);
        }
      }
    });
  }, [navigate]);

  return null;
};

export default ResponseInterceptor;
