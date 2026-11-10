import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createStore, Provider } from 'jotai';
import { lazy, Suspense } from 'react';

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
  return (
    <Suspense>
      <DialogMain
        id={TradesPageModal.DELETE_TRADING_SESSION}
        title="Are you absolutely sure?"
        hideCloseBtn
        dialogContentProps={{ dividers: false }}
      >
        <DeleteTradingSession />
      </DialogMain>

      <DialogMain id={TradesPageModal.ADD_TRADING_SESSION} title="Add trading session">
        <AddTradingSessionForm />
      </DialogMain>

      <DialogMain id={TradesPageModal.EDIT_TRADING_SESSION} title="Edit trading session">
        <EditTradingSessionForm />
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
