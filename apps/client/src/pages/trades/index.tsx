import { lazy } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useAtom, useAtomValue } from 'jotai';

import type { Trade } from '../../types/trade';
import TradingSessionSelect from './TradingSessionSelect';
import DialogMain from '../../components/DialogMain';
import useModal from '../../hooks/useModal';
import { modalAtom } from '../../atoms/modal';
import { TradesPageModal } from './enums';
import usePairsOptions from './hooks/usePairsOptions';
import AutocompleteFilter from '../../components/table/filters/AutocompleteFilter';
import { resultOptions } from './consts';
import TableProviders from '../../components/table/providers';
import DateFilter from '../../components/table/filters/DateFilter';
import { tradesFiltersAtom } from '../../atoms/trades';

const AddTradeForm = lazy(() => import('./forms/AddTrade'));
const EditTradeForm = lazy(() => import('./forms/EditTrade'));
const DeleteTrade = lazy(() => import('./DeleteTrade'));
const TradesSettingsMain = lazy(() => import('./Settings'));

const TradesTableMain = lazy(() => import('./TradesTable'));
const AddTagForm = lazy(() => import('./Settings/Tags/forms/AddForm'));

const TradesModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id={TradesPageModal.ADD_TRADE} title="Add trade">
        <AddTradeForm />
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

const TradesFiltersContainer = ({ children }: { children: React.ReactNode }) => {
  const tradesFilters = useAtomValue(tradesFiltersAtom);
  return <Collapse in={tradesFilters}>{children}</Collapse>;
};

const TradesTableContainer = () => {
  const pairsOptions = usePairsOptions();

  return (
    <TableProviders>
      <Stack>
        <TradesFiltersContainer>
          <Box
            sx={{
              mb: 2,
              width: '100%',
              gap: 2,
              display: 'grid',
              gridTemplateColumns: { xl: 'repeat(6, 1fr)', lg: 'repeat(4, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            <AutocompleteFilter name="pair" label="Pair" options={pairsOptions} />
            <AutocompleteFilter name="result" label="Result" options={resultOptions} />
            <DateFilter name="openDate" label="Open" disableFuture />
            <DateFilter name="closeDate" label="Close" disableFuture />
          </Box>
        </TradesFiltersContainer>

        <TradesTableMain />
      </Stack>
    </TableProviders>
  );
};

const TradesFiltersButton = () => {
  const [tradesFilters, setTradesFilters] = useAtom(tradesFiltersAtom);

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
        onClick={() => setTradesFilters((prevValue) => !prevValue)}
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

const TradesPage = () => {
  const { openModal } = useModal();

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h5">Trades</Typography>

            <Stack direction="row" alignItems="center" gap={1}>
              <IconButton
                size="small"
                aria-label="add-trade-button"
                onClick={() => openModal(TradesPageModal.ADD_TRADE)}
              >
                <AddIcon />
              </IconButton>
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
        <TradesTableContainer />
      </Paper>

      <TradesModalList />
    </>
  );
};

export default TradesPage;
