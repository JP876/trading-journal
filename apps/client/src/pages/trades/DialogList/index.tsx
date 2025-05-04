import useAppStore from '@/store';
import AddTradeForm from '../Forms/AddTrade';
import DeleteTrade from './DeleteTrade';
import EditTradeForm from '../Forms/EditTrade';
import AddAccountForm from '../Accounts/Forms/AddAccount';
import { TradeDialogListIds } from '../types';
import { AccountDialogListIds } from '../Accounts/types';
import DialogMain from '@/components/DialogMain';
import TradeFiles from '../DataTable/TradeFiles';

const DialogList = () => {
  const modalInfo = useAppStore((state) => state.modalInfo);

  return (
    <>
      <DialogMain id={TradeDialogListIds.ADD_TRADE} title="Add Trade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain id={TradeDialogListIds.EDIT_TRADE} title="Edit Trade">
        <EditTradeForm trade={modalInfo?.[TradeDialogListIds.EDIT_TRADE]?.data} />
      </DialogMain>

      <DialogMain id={TradeDialogListIds.TRADE_FILES} title="Trade Files">
        <TradeFiles trade={modalInfo?.[TradeDialogListIds.TRADE_FILES]?.data} />
      </DialogMain>

      <DeleteTrade />

      <DialogMain id={AccountDialogListIds.ADD_ACCOUNT} title="Add account">
        <AddAccountForm />
      </DialogMain>
    </>
  );
};

export default DialogList;
