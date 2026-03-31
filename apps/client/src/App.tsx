import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router';

import SnackbarContainer from './components/SnackbarContainer';
import { router } from './router';

const App = () => {
  return (
    <Box component="main">
      <CssBaseline />
      <SnackbarContainer />
      <RouterProvider router={router} />
    </Box>
  );
};

export default App;
