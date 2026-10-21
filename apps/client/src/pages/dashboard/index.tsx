import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TradingSessionSelect from '../trades/TradingSessionSelect';
import useResetWidgets from './hooks/useResetWidgets';
import ConsecutiveTrades from './widgets/ConsecutiveTrades';
import ProfitablePairs from './widgets/ProfitablePairs';
import TradeDurations from './widgets/TradeDurations';
import Performance from './widgets/Performance';

const DashboardMain = () => {
  const [handleReset] = useResetWidgets();

  return (
    <Box sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Stack direction="row" alignItems="center" gap={2}>
          <TradingSessionSelect onSuccess={handleReset} />
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
        <Performance />
        <ProfitablePairs />
        <ConsecutiveTrades />
        <TradeDurations />
      </Box>
    </Box>
  );
};

export default DashboardMain;
