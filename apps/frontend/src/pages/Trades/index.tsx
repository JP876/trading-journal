import { Paper, Stack, Typography } from '@mui/material';

import TradesTableMain from './TradesTable';
import useAppStore from '@/store';
import DialogMain from '@/components/DialogMain';
import AddTradeForm from './forms/AddTrade';
import DeleteTradeDialog from './DeleteTrade';
import EditTradeForm from './forms/EditTrade';
import AddTradeBtn from './AddTradeBtn';
import VisibilityColumnSelect from './VisibilityColumnSelect';
import AccountsSelect from './AccountsSelect';

const TradesModalList = () => {
  const modalInfo = useAppStore((state) => state.modalInfo);
  const closeModal = useAppStore((state) => state.closeModal);

  return (
    <>
      <DialogMain title="Add Trade" id="addTrade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain title="Edit Trade" id="editTrade">
        <EditTradeForm trade={modalInfo?.editTrade?.data} />
      </DialogMain>

      <DeleteTradeDialog trade={modalInfo?.deleteTrade?.data} closeModal={() => closeModal('deleteTrade')} />
    </>
  );
};

const TradesMain = () => {
  return (
    <Stack>
      <Paper sx={{ p: 2 }}>
        <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight="400">
              Trades
            </Typography>
            <AddTradeBtn />
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            <AccountsSelect />
            <VisibilityColumnSelect />
          </Stack>
        </Stack>

        <TradesTableMain />
      </Paper>

      <TradesModalList />
    </Stack>
  );
};

export default TradesMain;
