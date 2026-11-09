import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getDefaultStore, useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';

import { retryAtom } from '../../atoms';
import useSnackbar from '../../hooks/useSnackbar';
import { RETRY_OPTIONS } from '../../lib/queryClient';

const RetryContainer = () => {
  const retryInfo = useAtomValue(retryAtom, { store: getDefaultStore() });
  const { openSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (retryInfo.isRetrying) {
      openSnackbar({
        autoHideDuration: RETRY_OPTIONS.delay * RETRY_OPTIONS.count + 10,
        severity: 'warning',
        message: `Request failed. Retrying... (attempt ${retryInfo.count} of ${RETRY_OPTIONS.count}; next retry in ${RETRY_OPTIONS.delay / 1_000} seconds)`,
      });
    } else {
      closeSnackbar();
    }
  }, [retryInfo.isRetrying, retryInfo.count]);

  return (
    <Backdrop
      sx={[(theme) => ({ color: theme.palette.grey[100], zIndex: theme.zIndex.drawer + 1 })]}
      open={retryInfo.isRetrying}
    >
      <CircularProgress color="inherit" size={72} />
    </Backdrop>
  );
};

export default memo(RetryContainer);
