import { createTheme } from '@mui/material';

export const theme = createTheme({
  cssVariables: false,
  colorSchemes: { dark: true },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(', '),
  },
});
