import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { theme } from './theme';
import { queryClient } from './lib/queryClient';

const cache = createCache({ key: 'mui', prepend: true });

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Provider>{children}</Provider>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
};

export default Providers;
