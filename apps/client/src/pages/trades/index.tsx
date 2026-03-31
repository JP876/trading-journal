import { lazy } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAtomValue } from 'jotai';

import type { Trade } from '../../types/trade';
import TradingSessionSelect from './TradingSessionSelect';
import DialogMain from '../../components/DialogMain';
import useModal from '../../hooks/useModal';
import { modalAtom } from '../../atoms/modal';
import { TradesPageModal } from './enums';
import PaginationProvider from '../../components/table/providers/Pagination';
import FiltersProvider from '../../components/table/providers/Filters';
import usePairsOptions from './hooks/usePairOptions';
import SelectFilter from '../../components/table/filters/SelectFilter';
import { resultOptions } from './consts';

const AddTradeForm = lazy(() => import('./forms/AddTrade'));
const EditTradeForm = lazy(() => import('./forms/EditTrade'));
const DeleteTrade = lazy(() => import('./DeleteTrade'));
const TradesSettingsMain = lazy(() => import('./Settings'));

const TradesTableMain = lazy(() => import('./TradesTable'));

const TradesModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id={TradesPageModal.ADD_TRADE} title="Add trade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain title={TradesPageModal.EDIT_TRADE} id="editTradeForm">
        <EditTradeForm trade={modalInfo?.[TradesPageModal.EDIT_TRADE]?.data as Trade} />
      </DialogMain>

      <DialogMain
        id={TradesPageModal.DELETE_TRADE}
        title="Are you absolutely sure?"
        hideCloseBtn
        dialogContentProps={{ dividers: false }}
      >
        <DeleteTrade trade={modalInfo?.[TradesPageModal.DELETE_TRADE]?.data as Trade} />
      </DialogMain>

      <DialogMain id={TradesPageModal.SETTINGS} title="Settings" size="md">
        <TradesSettingsMain />
      </DialogMain>
    </>
  );
};

const TradesTableContainer = () => {
  const pairOptions = usePairsOptions();

  return (
    <PaginationProvider>
      <FiltersProvider>
        <Stack gap={2}>
          <Box
            sx={{
              gap: 2,
              display: 'grid',
              gridTemplateColumns: { xl: 'repeat(6, 1fr)', lg: 'repeat(4, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            <SelectFilter name="pair" label="Pair" options={pairOptions} />
            <SelectFilter name="result" label="Result" options={resultOptions} />
          </Box>
          <TradesTableMain />
        </Stack>
      </FiltersProvider>
    </PaginationProvider>
  );
};

const TradesPage = () => {
  const { openModal } = useModal();

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h5">Trades</Typography>
            <IconButton size="small" aria-label="add-trade-button" onClick={() => openModal(TradesPageModal.ADD_TRADE)}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <IconButton
              size="small"
              aria-label="trades-settings-button"
              onClick={() => openModal(TradesPageModal.SETTINGS)}
            >
              <SettingsIcon />
            </IconButton>
            <TradingSessionSelect />
          </Stack>
        </Stack>
        <TradesTableContainer />
      </Paper>

      <TradesModalList />
    </>
  );
};

export default TradesPage;
