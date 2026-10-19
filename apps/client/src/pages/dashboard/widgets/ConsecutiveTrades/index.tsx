import { memo } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ConsecutiveTradesChart from './ConsecutiveTradesChart';
import ClampedTextContainer from '../../../../components/ClampedTextContainer';

const ConsecutiveTrades = () => {
  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2), display: 'flex', flexDirection: 'column' })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack>
          <Typography variant="h5">Consecutive trades</Typography>
          <ClampedTextContainer variant="caption">
            View how often your trades cluster into winning or losing streaks
          </ClampedTextContainer>
        </Stack>
      </Stack>

      <ConsecutiveTradesChart />
    </Paper>
  );
};

export default memo(ConsecutiveTrades);
