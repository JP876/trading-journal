import { Box } from '@mui/material';

import ConsecutiveTrades from './widgets/ConsecutiveTrades';
import TradeDurations from './widgets/TradeDurations';
import ProfitablePairs from './widgets/ProfitablePairs';

const DashboardMain = () => {
  return (
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
  );
};

export default DashboardMain;
