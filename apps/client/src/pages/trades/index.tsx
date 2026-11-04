import AddIcon from '@mui/icons-material/Add';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import PublishIcon from '@mui/icons-material/Publish';
import QueueIcon from '@mui/icons-material/Queue';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { lazy } from 'react';

import { getTrades } from '../../api/trades';
import { modalAtom } from '../../atoms/modal';
import { tradesFiltersAtom } from '../../atoms/trades';
import { userAtom } from '../../atoms/user';
import DialogMain from '../../components/DialogMain';
import MenuActions from '../../components/MenuActions';
import AutocompleteFilter from '../../components/table/filters/AutocompleteFilter';
import DateFilter from '../../components/table/filters/DateFilter';
import useClearFilters from '../../components/table/hooks/useClearFilters';
import TableProviders from '../../components/table/providers';
import { QueryKey } from '../../enums';
import useModal from '../../hooks/useModal';
import type { Trade } from '../../types/trade';
import { resultOptions } from './consts';
import { TradesPageModal } from './enums';
import useExportTrades from './hooks/useExportTrades';
import usePairsOptions from './hooks/usePairsOptions';
import useTagsOptions from './hooks/useTagsOptions';
import TradingSessionSelect from './TradingSessionSelect';

const AddTradeForm = lazy(() => import('./forms/AddTrade'));
const AddRandomTradesForm = lazy(() => import('./forms/AddRandomTrades'));
const EditTradeForm = lazy(() => import('./forms/EditTrade'));
const DeleteTrade = lazy(() => import('./DeleteTrade'));
const TradesSettingsMain = lazy(() => import('./Settings'));
const ImportTrades = lazy(() => import('./ImportTrades'));

const TradesTableMain = lazy(() => import('./TradesTable'));
const AddTagForm = lazy(() => import('./Settings/Tags/forms/AddForm'));

const TradesModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id={TradesPageModal.ADD_TRADE} title="Add trade">
        <AddTradeForm />
      </DialogMain>

      <DialogMain id={TradesPageModal.ADD_RANDOM_TRADES} title="Add random trades">
        <AddRandomTradesForm />
      </DialogMain>

      <DialogMain id={TradesPageModal.IMPORT_TRADES} size="md" title="Import trades">
        <ImportTrades />
      </DialogMain>

      <DialogMain id={TradesPageModal.EDIT_TRADE} title="Edit trade">
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

      <DialogMain size="xs" id={TradesPageModal.ADD_TAG} title="Add tag">
        <AddTagForm />
      </DialogMain>
    </>
  );
};

const COLLAPSE_TIMEOUT = 200;

const TradesFiltersContainer = ({ children }: { children: React.ReactNode }) => {
  const tradesFilters = useAtomValue(tradesFiltersAtom);

  return (
    <Collapse in={tradesFilters} timeout={COLLAPSE_TIMEOUT}>
      {children}
    </Collapse>
  );
};

const TradesFilters = () => {
  const pairsOptions = usePairsOptions();
  const tagsOptions = useTagsOptions();

  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  let uniquePairs = [...new Set((tradesQuery.data?.results || []).map((el) => el.pair))];

  return (
    <Box
      sx={{
        mb: 2,
        width: '100%',
        gap: 2,
        display: 'grid',
        gridTemplateColumns: { xl: 'repeat(6, 1fr)', lg: '12rem 12rem repeat(3, 1fr)', md: 'repeat(3, 1fr)' },
      }}
    >
      <AutocompleteFilter
        name="pair"
        label="Pair"
        options={pairsOptions}
        getOptionDisabled={(option) => {
          return !uniquePairs.includes(+option.value);
        }}
      />
      <AutocompleteFilter name="result" label="Result" options={resultOptions} />
      <DateFilter name="openDate" label="Open" disableFuture />
      <DateFilter name="closeDate" label="Close" disableFuture />
      <AutocompleteFilter name="tags" label="Tags" options={tagsOptions} multiple limitTags={1} />
    </Box>
  );
};

const TradesFiltersButton = () => {
  const [tradesFilters, setTradesFilters] = useAtom(tradesFiltersAtom);
  const [clearFilters] = useClearFilters({ wait: COLLAPSE_TIMEOUT + 20 });

  const handleClick = () => {
    setTradesFilters((prevValue) => !prevValue);
    clearFilters();
  };

  return (
    <Box
      sx={(theme) => ({
        width: '34px',
        height: '34px',
        position: 'relative',

        '& svg': {
          position: 'absolute',
          transition: theme.transitions.create(['opacity']),
        },
        '#open': { opacity: +!tradesFilters },
        '#close': { opacity: +!!tradesFilters },
      })}
    >
      <IconButton
        size="small"
        aria-label={`${tradesFilters ? 'close' : 'open'}-filters-button`}
        onClick={handleClick}
        sx={{
          width: 'inherit',
          height: 'inherit',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <FilterListIcon id="open" />
        <FilterListOffIcon id="close" />
      </IconButton>
    </Box>
  );
};

const ExportTradesItem = () => {
  const [handleExport] = useExportTrades();

  const handleClick = (_: any, handleClose: () => void) => {
    handleClose();
    handleExport();
  };

  return <MenuActions.Item icon={<FileDownloadIcon />} label="Export trades" onClick={handleClick} />;
};

const TradesPage = () => {
  const { openModal } = useModal();
  const user = useAtomValue(userAtom);

  const handleClick = (handleClose: () => void, fn: () => void) => {
    handleClose();
    fn();
  };

  return (
    <TableProviders>
      <Paper sx={{ p: 2 }}>
        <Stack mb={4} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h4">Trades</Typography>

            <Stack direction="row" alignItems="center" gap={1}>
              {user?.variety === 'GUEST' ? (
                <MenuActions btnProps={{ children: <ControlPointIcon /> }}>
                  {/* Implemented only when user is logged in as guest */}
                  <MenuActions.Item
                    icon={<AddIcon />}
                    label="Add trade"
                    onClick={(_, handleClose) => handleClick(handleClose, () => openModal(TradesPageModal.ADD_TRADE))}
                  />
                  <MenuActions.Divider />
                  <MenuActions.Item
                    icon={<PublishIcon />}
                    label="Import trades"
                    onClick={(_, handleClose) =>
                      handleClick(handleClose, () => openModal(TradesPageModal.IMPORT_TRADES))
                    }
                  />
                  <ExportTradesItem />
                  <MenuActions.Divider />
                  <MenuActions.Item
                    icon={<QueueIcon />}
                    label="Add random trades"
                    onClick={(_, handleClose) =>
                      handleClick(handleClose, () => openModal(TradesPageModal.ADD_RANDOM_TRADES))
                    }
                  />
                </MenuActions>
              ) : (
                <IconButton
                  size="small"
                  aria-label="add-trade-button"
                  onClick={() => openModal(TradesPageModal.ADD_TRADE)}
                >
                  <AddIcon />
                </IconButton>
              )}

              <TradesFiltersButton />
            </Stack>
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

        <Stack>
          <TradesFiltersContainer>
            <TradesFilters />
          </TradesFiltersContainer>
          <TradesTableMain />
        </Stack>
      </Paper>

      <TradesModalList />
    </TableProviders>
  );
};

export default TradesPage;
