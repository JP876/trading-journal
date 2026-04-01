import { memo } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { getDefaultStore, useAtomValue } from 'jotai';

import { snackbarAtom } from '../../atoms/snackbar';
import useSnackbar from '../../hooks/useSnackbar';

const SnackbarContainer = () => {
  const info = useAtomValue(snackbarAtom, { store: getDefaultStore() });
  const { closeSnackbar } = useSnackbar();

  return (
    <Snackbar
      open={info.open}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={info.autoHideDuration || 6_000}
    >
      <Alert severity={info.severity} variant={info.variant} onClose={closeSnackbar}>
        {info.message}
      </Alert>
    </Snackbar>
  );
};

export default memo(SnackbarContainer);
