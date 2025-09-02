import React from 'react';
import { Stack } from '@mui/material';

const StatsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      id="num-of-trades-container"
      sx={[
        (theme) => ({
          py: 1,
          gap: 0.5,
          width: '100%',
          height: '100%',
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: '.5rem',
          boxShadow: theme.shadows[1],
        }),
      ]}
    >
      {children}
    </Stack>
  );
};

export default StatsContainer;
