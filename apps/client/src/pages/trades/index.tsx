import Paper from '@/components/ui/paper';
import TradeRecordsDataTable from './DataTable';
import DialogList from './DialogList';
import AccountsMain from './Accounts';

const TradeRecordsMain = () => {
  return (
    <div className="w-full flex flex-col gap-4 ">
      <Paper>
        <AccountsMain />
      </Paper>

      <Paper>
        <TradeRecordsDataTable />
      </Paper>

      <DialogList />
    </div>
  );
};

export default TradeRecordsMain;
