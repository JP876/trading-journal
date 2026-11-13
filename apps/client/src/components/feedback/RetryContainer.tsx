import { getDefaultStore, useAtomValue } from "jotai";
import { memo, useEffect } from "react";

import { retryAtom } from "../../atoms";
import useSnackbar from "../../hooks/useSnackbar";
import { RETRY_OPTIONS } from "../../lib/queryClient";
import BackdropProgress from "./BackdropProgress";

const RetryContainer = () => {
  const retryInfo = useAtomValue(retryAtom, { store: getDefaultStore() });
  const { openSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (retryInfo.isRetrying) {
      openSnackbar({
        autoHideDuration: RETRY_OPTIONS.delay * RETRY_OPTIONS.count + 10,
        severity: "warning",
        message: `Request failed. Retrying... (attempt ${retryInfo.count} of ${RETRY_OPTIONS.count}; next retry in ${RETRY_OPTIONS.delay / 1_000} seconds)`,
      });
    } else {
      closeSnackbar();
    }
  }, [retryInfo.isRetrying, retryInfo.count]);

  return <BackdropProgress open={retryInfo.isRetrying} />;
};

export default memo(RetryContainer);
