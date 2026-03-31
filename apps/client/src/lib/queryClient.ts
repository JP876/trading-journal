import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const onError = (error: Error) => {
  if (error instanceof AxiosError && error.status === 401) {
    document.dispatchEvent(new CustomEvent('is-authenticated', { detail: false }));
  }
};

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError,
  }),
  queryCache: new QueryCache({
    onError,
  }),
});
