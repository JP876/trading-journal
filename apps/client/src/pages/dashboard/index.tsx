import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import TradingSessionSelect from '../trades/TradingSessionSelect';
import useResetWidgets from './hooks/useResetWidgets';
import ConsecutiveTrades from './widgets/ConsecutiveTrades';
import ProfitablePairs from './widgets/ProfitablePairs';
import TradeDurations from './widgets/TradeDurations';
import Performance from './widgets/Performance';
import Statistics from './widgets/Statistics';

const WidgetsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '2fr 3fr 3fr',
  gridAutoRows: 'clamp(20rem, 32vw, 24rem)',
  gridTemplateAreas: `
    "stats performance profitable"
    "stats consecutive durations"
  `,

  [theme.breakpoints.down('xl')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateAreas: `
      "stats performance"
      "stats durations"
      "consecutive profitable"
    `,
  },

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `
      "stats"
      "performance"
      "durations"
      "consecutive"
      "profitable"
    `,
  },
}));

const DashboardHeader = () => {
  const [handleReset] = useResetWidgets();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Stack direction="row" alignItems="center" gap={2}>
        <TradingSessionSelect onSuccess={handleReset} />
      </Stack>
    </Stack>
  );
};

const DashboardMain = () => {
  return (
    <Box>
      <DashboardHeader />
      <WidgetsContainer>
        <Statistics paperProps={{ sx: { gridArea: 'stats', overflowY: 'auto' } }} />
        <Performance paperProps={{ sx: { gridArea: 'performance' } }} />
        <ProfitablePairs paperProps={{ sx: { gridArea: 'profitable' } }} />
        <ConsecutiveTrades paperProps={{ sx: { gridArea: 'consecutive' } }} />
        <TradeDurations paperProps={{ sx: { gridArea: 'durations' } }} />
      </WidgetsContainer>
    </Box>
  );
};

export default DashboardMain;
