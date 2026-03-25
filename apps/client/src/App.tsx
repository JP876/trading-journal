import { Box, CssBaseline } from '@mui/material';

import SnackbarContainer from './components/SnackbarContainer';
import RouterMain from './router';

const App = () => {
  return (
    <Box component="main">
      <CssBaseline />
      <SnackbarContainer />
      <RouterMain />
    </Box>
  );
};

export default App;
