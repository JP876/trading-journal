import { Box, Stack, Typography } from '@mui/material';

import TradingSessionSelect from './TradingSessionSelect';

const TradesPage = () => {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography variant="h5">Trades</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={2}>
          <TradingSessionSelect />
        </Stack>
      </Stack>
    </Box>
  );
};

export default TradesPage;
