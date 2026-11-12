import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDefaultStore, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import type { TAuthDetail } from "../types";

import { refreshToken } from "../api/auth";
import { getPairs } from "../api/pairs";
import { pairsAtom } from "../atoms";
import { AUTH_EVENT_TYPE } from "../consts";
import { QueryKey } from "../enums";
import useEventListeners from "../hooks/useEventListeners";
import useLogout from "../hooks/useLogout";
import useSnackbar from "../hooks/useSnackbar";
import { isGuest } from "../lib/utils";

const REFETCH_INTERVAL = 9 * 60 * 1_000;

const refreshTokenQueryOptions = queryOptions({
  queryKey: [QueryKey.REFRESH_TOKEN],
  queryFn: refreshToken,
  retry: false,
  refetchInterval: REFETCH_INTERVAL,
  refetchIntervalInBackground: true,
});

const ProtectedRoutes = () => {
  const [enabled, setEnabled] = useState(false);

  const { openSnackbar } = useSnackbar();
  const [logout] = useLogout();

  const setPairs = useSetAtom(pairsAtom, { store: getDefaultStore() });

  const handleEvent = (event: CustomEventInit<TAuthDetail>) => {
    if (event.detail && !event.detail.isAuthenticated) {
      setTimeout(() => {
        logout(event.detail?.prevLocation);
        openSnackbar({
          severity: "error",
          message: "Looks like you're not logged in. Please sign in.",
        });
      }, 0);
    }
  };

  const { data, isFetched } = useQuery({ queryKey: [QueryKey.PAIRS], queryFn: getPairs, staleTime: Infinity });
  useQuery({ ...refreshTokenQueryOptions, enabled: enabled });

  useEffect(() => {
    if (isFetched && Array.isArray(data) && data.length > 0) {
      setPairs(data);
    }
  }, [isFetched, data]);

  useEffect(() => {
    if (!isGuest()) {
      setTimeout(() => setEnabled(true), REFETCH_INTERVAL);
    }
  }, []);

  useEventListeners([[AUTH_EVENT_TYPE, handleEvent]]);

  return <Outlet />;
};

export default ProtectedRoutes;
