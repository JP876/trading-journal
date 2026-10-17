import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

import ProfitablePairsChart from './ProfitablePairsChart';

const ProfitablePairs = () => {
  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack>
          <Typography variant="h5">Most Profitable pairs</Typography>
          <Typography variant="caption">See which trading pairs generated the highest net profit</Typography>
        </Stack>
      </Stack>

      <ProfitablePairsChart />
    </Paper>
  );
};

export default memo(ProfitablePairs);
