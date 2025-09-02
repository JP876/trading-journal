import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Backdrop, Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

import TradesTableMain from './TradesTable';
import useAppStore from '@/store';
import DialogMain from '@/components/DialogMain';
import AddTradeForm from './forms/AddTrade';
import DeleteTradeDialog from './DeleteTrade';
import EditTradeForm from './forms/EditTrade';
import VisibilityColumnSelect from './VisibilityColumnSelect';
import AccountsSelect from './AccountsSelect';
import TradesSettings from './TradesSettings';
import DeleteAccountDialog from './TradesSettings/Accounts/DeleteAccount';
import AddAccountForm from './TradesSettings/Accounts/forms/AddAccount';
import EditAccountForm from './TradesSettings/Accounts/forms/EditAccount';
import TableProviderMain from '@/components/table/Provider';
import TableSelectFilter from '@/components/table/filters/TableSelectFilter';
import { directionItems, pairOptions, resultItems } from './forms/consts';
import TableDateFilter from '@/components/table/filters/TableDateFilter';
import TradeFilesMain from './TradeFiles';
import AddTagForm from './TradesSettings/Tags/forms/AddTag';
import EditTagForm from './TradesSettings/Tags/forms/EditTag';
import DeleteTagDialog from './TradesSettings/Tags/DeleteTag';
import { getTags } from '@/api/tags';
import { SelectOptionType } from '@/types';
import StatsMain from './Stats';

const TradesModalList = () => {
  const modalInfo = useAppStore((state) => state.modalInfo);
  const closeModal = useAppStore((state) => state.closeModal);

  const handleCloseTradeFiles = () => closeModal('tradeFiles');

  return (
    <>
      <DialogMain dialogProps={{ maxWidth: 'md' }} title="Trades Settings" id="tradesSettings">
        <TradesSettings />
      </DialogMain>

      <>
        <DialogMain title="Add Trade" id="addTrade">
          <AddTradeForm />
        </DialogMain>

        <DialogMain title="Edit Trade" id="editTrade">
          <EditTradeForm trade={modalInfo?.editTrade?.data} />
        </DialogMain>

        <Backdrop
          open={!!modalInfo?.tradeFiles?.open}
          sx={[(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })]}
        >
          <TradeFilesMain trade={modalInfo?.tradeFiles?.data} closeModal={handleCloseTradeFiles} />
        </Backdrop>

        <DeleteTradeDialog trade={modalInfo?.deleteTrade?.data} closeModal={() => closeModal('deleteTrade')} />
      </>

      <>
        <DialogMain title="Add Account" id="addAccount">
          <AddAccountForm />
        </DialogMain>

        <DialogMain title="Edit Account" id="editAccount">
          <EditAccountForm account={modalInfo?.editAccount?.data} />
        </DialogMain>

        <DeleteAccountDialog account={modalInfo?.deleteAccount?.data} closeModal={() => closeModal('deleteAccount')} />
      </>

      <>
        <DialogMain title="Add Tag" id="addTag">
          <AddTagForm />
        </DialogMain>

        <DialogMain title="Edit Tag" id="editTag">
          <EditTagForm tag={modalInfo?.editTag?.data} />
        </DialogMain>

        <DeleteTagDialog tag={modalInfo?.deleteTag?.data} closeModal={() => closeModal('deleteTag')} />
      </>
    </>
  );
};

const AddTradeBtn = () => {
  const openModal = useAppStore((state) => state.openModal);
  return (
    <Tooltip arrow title="Add Trade" disableInteractive>
      <IconButton size="small" onClick={() => openModal({ id: 'addTrade' })}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
};

const TradesSettingsBtn = () => {
  const openModal = useAppStore((state) => state.openModal);
  return (
    <Tooltip arrow title="Settings" disableInteractive>
      <IconButton size="small" onClick={() => openModal({ id: 'tradesSettings' })}>
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  );
};

const TradeTagsFilter = () => {
  const { data, isLoading } = useQuery({ queryKey: ['tags'], queryFn: getTags });

  const tagOptions: SelectOptionType[] = useMemo(() => {
    return (data || []).map((tag) => ({ id: tag._id, label: tag.name, chipBackground: tag?.color }));
  }, [data]);

  return (
    <TableSelectFilter name="tags" label="Tags" options={tagOptions} disabled={isLoading} multiple limitTags={2} />
  );
};

const TradesTableContainer = () => {
  return (
    <TableProviderMain>
      <Stack gap={2}>
        <Box
          sx={() => ({
            gap: 2,
            display: 'grid',
            gridTemplateColumns: { lg: '1fr .8fr .8fr 1fr 1fr 1.5fr', md: '1fr 1fr 1fr' },
          })}
        >
          <TableSelectFilter name="pair" label="Pair" options={pairOptions} />
          <TableSelectFilter name="direction" label="Direction" options={directionItems} />
          <TableSelectFilter name="result" label="Result" options={resultItems} />
          <TableDateFilter name="openDate" label="Open Date" />
          <TableDateFilter name="closeDate" label="Close Date" />
          <TradeTagsFilter />
        </Box>

        <TradesTableMain />
      </Stack>
    </TableProviderMain>
  );
};

const TradesMain = () => {
  return (
    <>
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight="400">
              Trades
            </Typography>
            <AddTradeBtn />
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            <TradesSettingsBtn />
            <AccountsSelect />
            <VisibilityColumnSelect />
          </Stack>
        </Stack>

        <StatsMain />

        <TradesTableContainer />
      </Paper>

      <TradesModalList />
    </>
  );
};

export default TradesMain;
