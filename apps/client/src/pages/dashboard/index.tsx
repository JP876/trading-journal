import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { getTrades } from '../../api/trades';
import { QueryKey } from '../../enums';
import TradingSessionSelect from '../trades/TradingSessionSelect';
import useResetWidgets from './hooks/useResetWidgets';
import ConsecutiveTrades from './widgets/ConsecutiveTrades';
import Performance from './widgets/Performance';
import ProfitablePairs from './widgets/ProfitablePairs';
import Statistics from './widgets/Statistics';
import TradeDurations from './widgets/TradeDurations';

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

const TradesNotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/trades', { viewTransition: true });
  };

  return (
    <Stack
      direction="column"
      gap={2}
      sx={[
        (theme) => ({
          position: 'fixed',
          zIndex: theme.zIndex.modal - 1,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: theme.spacing(2),
          maxWidth: 'min(32rem, 50vw)',
          backgroundColor: theme.palette.background.paper,
        }),
      ]}
    >
      <Typography variant="body1">
        Nothing to display just yet. Add your first trade to see your dashboard come to life.
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={handleClick}>
          Go to Trades page
        </Button>
      </Stack>
    </Stack>
  );
};

const LoadingTrades = () => {
  return (
    <WidgetsContainer>
      <Skeleton variant="rectangular" sx={{ gridArea: 'stats', height: '100%', width: '100%' }} />
      <Skeleton variant="rectangular" sx={{ gridArea: 'performance', height: '100%', width: '100%' }} />
      <Skeleton variant="rectangular" sx={{ gridArea: 'profitable', height: '100%', width: '100%' }} />
      <Skeleton variant="rectangular" sx={{ gridArea: 'consecutive', height: '100%', width: '100%' }} />
      <Skeleton variant="rectangular" sx={{ gridArea: 'durations', height: '100%', width: '100%' }} />
    </WidgetsContainer>
  );
};

const DashboardContent = () => {
  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  if (tradesQuery.isPending || tradesQuery.isLoading) return <LoadingTrades />;
  if (!tradesQuery.isFetched) return null;

  let hasTrades = Array.isArray(tradesQuery.data?.results) && tradesQuery.data.results.length > 0;
  if (!hasTrades) {
    return (
      <>
        <LoadingTrades />
        <TradesNotFound />
      </>
    );
  }

  return (
    <WidgetsContainer>
      <Statistics paperProps={{ sx: { gridArea: 'stats', overflowY: 'auto' } }} />
      <Performance paperProps={{ sx: { gridArea: 'performance' } }} />
      <ProfitablePairs paperProps={{ sx: { gridArea: 'profitable' } }} />
      <ConsecutiveTrades paperProps={{ sx: { gridArea: 'consecutive' } }} />
      <TradeDurations paperProps={{ sx: { gridArea: 'durations' } }} />
    </WidgetsContainer>
  );
};

const DashboardMain = () => {
  return (
    <Box>
      <DashboardHeader />
      <DashboardContent />
    </Box>
  );
};

export default DashboardMain;
