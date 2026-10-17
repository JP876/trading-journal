import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ConsecutiveTrades from './widgets/ConsecutiveTrades';
import TradeDurations from './widgets/TradeDurations';
import ProfitablePairs from './widgets/ProfitablePairs';
import TradingSessionSelect from '../trades/TradingSessionSelect';

const DashboardMain = () => {
  return (
    <Box sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Stack direction="row" alignItems="center" gap={2}>
          <TradingSessionSelect />
        </Stack>
      </Stack>

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(26rem, 1fr))',
          gridAutoRows: '22rem',
          gap: theme.spacing(2),
        })}
      >
        <ProfitablePairs />
        <ConsecutiveTrades />
        <TradeDurations />
      </Box>
    </Box>
  );
};

export default DashboardMain;
