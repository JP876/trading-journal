import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';

import { router } from './router';
import RetryContainer from './components/feedback/RetryContainer';
import SnackbarContainer from './components/feedback/SnackbarContainer';

const App = () => {
  return (
    <Box component="main">
      <CssBaseline />
      <SnackbarContainer />
      <RetryContainer />
      <RouterProvider router={router} />
    </Box>
  );
};

export default App;
