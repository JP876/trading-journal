import React from 'react';
import { Alert, Box, Snackbar, type SnackbarCloseReason } from '@mui/material';

import Router from './router';
import useAppStore from './store';

const ToastContainer = () => {
  const toastInfo = useAppStore((store) => store.toastInfo);
  const closeToast = useAppStore((state) => state.closeToast);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    closeToast();
  };

  return (
    <Snackbar open={!!toastInfo?.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert severity={toastInfo.severity} variant="filled" onClose={handleClose} sx={{ width: '100%' }}>
        {toastInfo.message}
      </Alert>
    </Snackbar>
  );
};

const App = () => {
  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
      <Router />
      <ToastContainer />
    </Box>
  );
};

export default App;
