import React from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';

type StatsContainerProps = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  isLoading?: boolean;
};

const StatsContainer = ({ isLoading, title, children }: StatsContainerProps) => {
  const renderChildren = () => {
    if (isLoading === undefined) return children;

    return isLoading ? (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={64} />
      </Box>
    ) : (
      children
    );
  };

  return (
    <Paper
      id="num-of-trades-container"
      sx={[
        (theme) => ({
          pt: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.grey[theme.palette.mode === 'light' ? 200 : 700]}`,
          borderRadius: '.5rem',
        }),
      ]}
    >
      {title ? (
        <Typography variant="h6" pl={2} mb={0.5}>
          {title}
        </Typography>
      ) : null}
      <Box sx={{ height: 'calc(100% - 2.4rem)' }}>{renderChildren()}</Box>
    </Paper>
  );
};

export default StatsContainer;
