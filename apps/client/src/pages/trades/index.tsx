import { lazy } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { useAtomValue } from 'jotai';

import type { Trade } from '../../types/trade';
import TradingSessionSelect from './TradingSessionSelect';
import DialogMain from '../../components/DialogMain';
import useModal from '../../hooks/useModal';
import TradesTableMain from './TradesTable';
import { modalAtom } from '../../atoms/modal';
import { TradesPageModalOptions } from './enums';

const AddTradeForm = lazy(() => import('./forms/AddTrade'));
const EditTradeForm = lazy(() => import('./forms/EditTrade'));
const DeleteTradeDialog = lazy(() => import('./DeleteTrade'));

const TradesModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id={TradesPageModalOptions.addTrade} title="Add trade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain title={TradesPageModalOptions.editTrade} id="editTradeForm">
        <EditTradeForm trade={modalInfo?.[TradesPageModalOptions.editTrade]?.data as Trade} />
      </DialogMain>

      <DeleteTradeDialog trade={modalInfo?.[TradesPageModalOptions.deleteTrade]?.data as Trade} />
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
            <IconButton size="small" disableRipple onClick={() => openModal(TradesPageModalOptions.addTrade)}>
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
