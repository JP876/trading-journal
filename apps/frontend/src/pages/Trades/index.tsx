import { Paper, Stack } from '@mui/material';

import TradesTableMain from './TradesTable';
import useAppStore from '@/store';
import DialogMain from '@/components/DialogMain';
import AddTradeForm from './forms/AddTrade';
import DeleteTradeDialog from './DeleteTrade';

const TradesModalList = () => {
  const modalInfo = useAppStore((state) => state.modalInfo);
  const closeModal = useAppStore((state) => state.closeModal);

  return (
    <>
      <DialogMain title="Add Trade" id="addTrade">
        <AddTradeForm />
      </DialogMain>

      <DeleteTradeDialog trade={modalInfo?.deleteTrade?.data} closeModal={() => closeModal('deleteTrade')} />
    </>
  );
};

const TradesMain = () => {
  return (
    <Stack>
      <Paper>
        <TradesTableMain />
      </Paper>

      <TradesModalList />
    </Stack>
  );
};

export default TradesMain;
