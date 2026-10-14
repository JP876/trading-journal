import { memo } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TradeDurationsChart from './TradeDurationsChart';

const TradeDurations = () => {
  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack>
          <Typography variant="h5">Trade durations</Typography>
          <Typography variant="caption">
            Your quickest profit. This is the ideal duration for your winning strategy.
          </Typography>
        </Stack>
      </Stack>
      <TradeDurationsChart />
    </Paper>
  );
};

export default memo(TradeDurations);
