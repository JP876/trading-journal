import { Box } from '@mui/material';

import ConsecutiveTrades from './widgets/ConsecutiveTrades';

const DashboardMain = () => {
  return (
    <Box
      sx={(theme) => ({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(28rem, 1fr))',
        gridTemplateRows: '24rem',
        gap: theme.spacing(2),
      })}
    >
      <ConsecutiveTrades />
    </Box>
  );
};

export default DashboardMain;
