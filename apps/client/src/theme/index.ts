import { createTheme } from '@mui/material';

export const theme = createTheme({
  cssVariables: false,
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(', '),
  },
});
