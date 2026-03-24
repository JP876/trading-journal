import { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';

import SnackbarContainer from './components/SnackbarContainer';
import RouterMain from './router';

const App = () => {
  useEffect(() => {
    (async () => {
      // await client.post('trades', transformToFormData({ takeProfit: 20 }));
    })();
  }, []);

  return (
    <Box component="main">
      <CssBaseline />
      <SnackbarContainer />
      <RouterMain />
    </Box>
  );
};

export default App;
