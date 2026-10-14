import { memo } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import TradeDurationsChart from './TradeDurationsChart';
import withCatch from '../../../../lib/withCatch';
import { getTradeDurations } from '../../../../lib/db/api/stats/duration';

const handleRefresh = async () => {
  const [err, trades] = await withCatch(getTradeDurations());
  if (err) {
    console.error(err);
    return null;
  }
  // console.log(trades);
};

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
        <Button variant="outlined" size="small" onClick={handleRefresh}>
          Refresh
        </Button>
      </Stack>
      <TradeDurationsChart />
    </Paper>
  );
};

export default memo(TradeDurations);
