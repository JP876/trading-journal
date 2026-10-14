import { memo } from 'react';
import { Paper, Stack, Typography } from '@mui/material';

import ConsecutiveTradesChart from './ConsecutiveTradesChart';

const ConsecutiveTrades = () => {
  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack>
          <Typography variant="h5">Consecutive trades</Typography>
          <Typography variant="caption">View how often your trades cluster into winning or losing streaks </Typography>
        </Stack>
      </Stack>
      <ConsecutiveTradesChart />
    </Paper>
  );
};

export default memo(ConsecutiveTrades);
