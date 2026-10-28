import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './lib/queryClient';
import { theme } from './theme';

const cache = createCache({ key: 'mui', prepend: true });

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default Providers;
