import { lazy } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import { useAtomValue } from 'jotai';

import type { Trade } from '../../types/trade';
import TradingSessionSelect from './TradingSessionSelect';
import DialogMain from '../../components/DialogMain';
import useModal from '../../hooks/useModal';
import TradesTableMain from './TradesTable';
import { modalAtom } from '../../atoms/modal';
import { TradesPageModal } from './enums';
import PaginationProvider from '../../components/table/providers/Pagination';
import FiltersProvider from '../../components/table/providers/Filters';
import usePairsOptions from './hooks/usePairOptions';
import SelectFilter from '../../components/table/filters/SelectFilter';
import { resultOptions } from './consts';

const AddTradeForm = lazy(() => import('./forms/AddTrade'));
const EditTradeForm = lazy(() => import('./forms/EditTrade'));
const DeleteTradeDialog = lazy(() => import('./DeleteTrade'));

const TradesModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id={TradesPageModal.addTrade} title="Add trade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain title={TradesPageModal.editTrade} id="editTradeForm">
        <EditTradeForm trade={modalInfo?.[TradesPageModal.editTrade]?.data as Trade} />
      </DialogMain>

      <DeleteTradeDialog trade={modalInfo?.[TradesPageModal.deleteTrade]?.data as Trade} />
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
              gridTemplateColumns: { lg: '1fr .8fr .8fr 1fr 1fr 1.5fr', md: '1fr 1fr 1fr' },
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
            <IconButton
              size="small"
              disableRipple
              title="Add trade button"
              aria-label="add-trade-button"
              onClick={() => openModal(TradesPageModal.addTrade)}
            >
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
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
