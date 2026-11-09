import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { getDefaultStore, useAtomValue } from 'jotai';
import { memo } from 'react';

import { snackbarAtom } from '../../atoms';
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
