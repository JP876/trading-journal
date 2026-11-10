import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createStore, getDefaultStore, Provider, useAtomValue } from 'jotai';
import { lazy, Suspense } from 'react';

import type { TradingSession } from '../../../../types/tradingSessions';

import { modalAtom } from '../../../../atoms';
import DialogMain from '../../../../components/DialogMain';
import { tablePaginationAtom } from '../../../../components/table/atoms';
import TextFilter from '../../../../components/table/filters/TextFilter';
import useModal from '../../../../hooks/useModal';
import { TradesPageModal } from '../../enums';
import TradingSessionsTable from './TableMain';

const AddTradingSessionForm = lazy(() => import('./forms/AddForm'));
const EditTradingSessionForm = lazy(() => import('./forms/EditForm'));
const DeleteTradingSession = lazy(() => import('./DeleteTradingSession'));

const sessionTableStore = createStore();
sessionTableStore.set(tablePaginationAtom, { pageIndex: 0, pageSize: 10 });

const TradingSessionModalList = () => {
  const modalInfo = useAtomValue(modalAtom, { store: getDefaultStore() });

  return (
    <Suspense>
      <DialogMain
        id={TradesPageModal.DELETE_TRADING_SESSION}
        title="Are you absolutely sure?"
        hideCloseBtn
        dialogContentProps={{ dividers: false }}
      >
        <DeleteTradingSession session={modalInfo?.[TradesPageModal.DELETE_TRADING_SESSION]?.data as TradingSession} />
      </DialogMain>

      <DialogMain id={TradesPageModal.ADD_TRADING_SESSION} title="Add trading session">
        <AddTradingSessionForm />
      </DialogMain>

      <DialogMain id={TradesPageModal.EDIT_TRADING_SESSION} title="Edit trading session">
        <EditTradingSessionForm session={modalInfo?.[TradesPageModal.EDIT_TRADING_SESSION]?.data as TradingSession} />
      </DialogMain>
    </Suspense>
  );
};

const TradingSessionsMain = () => {
  const { openModal } = useModal();

  return (
    <Provider store={sessionTableStore}>
      <Stack spacing={2}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <TextFilter name="title" label="Title" />
          </Box>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => openModal(TradesPageModal.ADD_TRADING_SESSION)}
            >
              Add session
            </Button>
          </Stack>
        </Stack>
        <TradingSessionsTable />
      </Stack>

      <TradingSessionModalList />
    </Provider>
  );
};

export default TradingSessionsMain;
