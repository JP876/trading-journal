import { Box, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TradingSessionSelect from './TradingSessionSelect';
import DialogMain from '../../components/DialogMain';
import AddTradeForm from './forms/AddTrade';
import useModal from '../../hooks/useModal';

const TradesModalList = () => {
  return (
    <>
      <DialogMain id="addTradeForm" title="Add trade">
        <AddTradeForm />
      </DialogMain>
    </>
  );
};

const TradesPage = () => {
  const { openModal } = useModal();

  return (
    <>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h5">Trades</Typography>
            <IconButton size="small" disableRipple onClick={() => openModal('addTradeForm')}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <TradingSessionSelect />
          </Stack>
        </Stack>
      </Box>

      <TradesModalList />
    </>
  );
};

export default TradesPage;
