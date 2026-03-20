import { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';

const App = () => {
  useEffect(() => {
    (async () => {
      // await client.post('trades', transformToFormData({ takeProfit: 20 }));
    })();
  }, []);

  return (
    <Box component="main">
      <CssBaseline />
    </Box>
  );
};

export default App;
