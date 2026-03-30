import { lazy } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useAtomValue } from 'jotai';

import TradingSessionsTable from './TableMain';
import useModal from '../../../../hooks/useModal';
import { TradesPageModal } from '../../enums';
import { modalAtom } from '../../../../atoms/modal';
import DialogMain from '../../../../components/DialogMain';
import type { TradingSession } from '../../../../types/tradingSessions';
import TableProviders from '../../../../components/table/providers';
import { Box } from '@mui/material';
import TextFilter from '../../../../components/table/filters/TextFilter';

const AddTradingSessionForm = lazy(() => import('./forms/AddForm'));
const EditTradingSessionForm = lazy(() => import('./forms/EditForm'));
const DeleteTradingSession = lazy(() => import('./DeleteTradingSession'));

const TradingSessionModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
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
    </>
  );
};

const TradingSessionsMain = () => {
  const { openModal } = useModal();

  return (
    <TableProviders>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <TextFilter name="title" label="Title" />
          </Box>
          <Stack direction="row" alignItems="center" gap={2}>
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
    </TableProviders>
  );
};

export default TradingSessionsMain;
