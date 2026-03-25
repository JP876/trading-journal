import { Box, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAtomValue } from 'jotai';

import type { Trade } from '../../types/trade';
import TradingSessionSelect from './TradingSessionSelect';
import DialogMain from '../../components/DialogMain';
import AddTradeForm from './forms/AddTrade';
import useModal from '../../hooks/useModal';
import TradesTableMain from './TradesTable';
import EditTradeForm from './forms/EditTrade';
import { modalAtom } from '../../atoms/modal';

const TradesModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id="addTradeForm" title="Add trade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain title="Edit Trade" id="editTradeForm">
        <EditTradeForm trade={modalInfo?.editTradeForm?.data as Trade} />
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
        <Stack mt={2}>
          <TradesTableMain />
        </Stack>
      </Box>

      <TradesModalList />
    </>
  );
};

export default TradesPage;
