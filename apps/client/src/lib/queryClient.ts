import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getDefaultStore } from "jotai";

import type { TAuthDetail } from "../types";

import { retryAtom } from "../atoms";
import { AUTH_EVENT_TYPE } from "../consts";
import { dispatchCustomEvent } from "./utils";

export const RETRY_OPTIONS = {
  count: 2,
  delay: 2_000,
} as const;

const onError = (error: Error) => {
  getDefaultStore().set(retryAtom, { isRetrying: false, count: 0, error });

  if (error instanceof AxiosError && error.status === 401) {
    dispatchCustomEvent<TAuthDetail>(AUTH_EVENT_TYPE, {
      detail: {
        isAuthenticated: false,
        prevLocation: undefined,
      },
    });
  }
};

const onSuccess = () => {
  getDefaultStore().set(retryAtom, { isRetrying: false, count: 0, error: null });
};

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({ onError, onSuccess }),
  queryCache: new QueryCache({ onError, onSuccess }),
  defaultOptions: {
    queries: {
      retryDelay: RETRY_OPTIONS.delay,
      retry: (failureCount, error) => {
        if (failureCount > 0) {
          getDefaultStore().set(retryAtom, { isRetrying: true, count: failureCount, error });
        }
        return failureCount <= RETRY_OPTIONS.count;
      },
    },
  },
});
