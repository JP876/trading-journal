import { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import SnackbarContainer from './components/SnackbarContainer';
import { routeTree } from './routeTree.gen';
import { queryClient } from './lib/queryClient';

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

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
      <RouterProvider router={router} />
    </Box>
  );
};

export default App;
