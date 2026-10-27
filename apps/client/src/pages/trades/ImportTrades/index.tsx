import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Provider, useAtom, useSetAtom } from 'jotai';
import { useEffect, type ChangeEvent } from 'react';

import UploadButton from '../../../components/UploadButton';
import { QueryKey } from '../../../enums';
import useSnackbar from '../../../hooks/useSnackbar';
import { handleCSVFile } from '../../../lib/CSVFile';
import { addMultipleTradesDB } from '../../../lib/db/api/trades';
import { queryClient } from '../../../lib/queryClient';
import withCatch from '../../../lib/withCatch';
import type { Pair } from '../../../types/pair';
import type { Trade } from '../../../types/trade';
import type { TradingSession, TradingSessionsResult } from '../../../types/tradingSessions';
import { fileAtom, importTradesStore, parsedFileResultAtom, resetStoreAtom } from './atoms';
import Description from './Description';
import transformTrades from './utils/transformTrades';

const getPairsAndSession = async (): Promise<[Pair[] | null, TradingSession | null]> => {
  let [sessions, pairs] = await Promise.all([
    queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]),
    queryClient.getQueryData<Pair[]>([QueryKey.PAIRS]),
  ]);
  let mainSession = sessions?.results?.find((el) => el?.isMain);
  return [pairs || null, mainSession || null];
};

const ConfirmImportButton = () => {
  const { openSnackbar } = useSnackbar();

  const handleImport = async () => {
    let [pairs, mainSession] = await getPairsAndSession();
    let result = importTradesStore.get(parsedFileResultAtom);

    if (!pairs || !mainSession || !result) {
      return;
    }

    let trades = transformTrades(result.data, pairs, mainSession);
    let [addErr] = await withCatch(addMultipleTradesDB(trades));

    if (addErr) {
      openSnackbar({
        severity: 'error',
        message: "We couldn't save these trades. Your data hasn't been imported. Please try again.",
      });
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
      queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES_COUNT_PER_TRADING_SESSION] }),
    ]);
  };

  return (
    <Button startIcon={<CheckIcon />} size="small" variant="contained" onClick={handleImport}>
      Confirm
    </Button>
  );
};

const ImportTradesButton = () => {
  const { openSnackbar } = useSnackbar();

  const setParesedFileResult = useSetAtom(parsedFileResultAtom, { store: importTradesStore });
  const [file, setFile] = useAtom(fileAtom, { store: importTradesStore });

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    if (!files) {
      openSnackbar({
        severity: 'error',
        message: 'This CSV appears to be empty. Check the file and upload it again.',
      });
      return;
    }
    setFile(files[0]);

    let result = await handleCSVFile<Trade>(files[0]);
    if (!result) return;

    setParesedFileResult(result);
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" my={1}>
      <UploadButton onChange={handleChange} accept=".csv, text/csv">
        Upload trades (CSV)
      </UploadButton>
      {file ? (
        <Stack>
          <Typography variant="subtitle1">
            {file.name} - {(file.size * 0.0009765625).toFixed(1)}kb
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
};

const ImportTradesMain = () => {
  return (
    <Stack gap={2}>
      <Description />
      <ImportTradesButton />
      <Divider />
      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <ConfirmImportButton />
      </Stack>
    </Stack>
  );
};

const ImportTrades = () => {
  const resetStore = useSetAtom(resetStoreAtom, { store: importTradesStore });

  useEffect(() => {
    resetStore();
  }, []);

  return (
    <Provider store={importTradesStore}>
      <ImportTradesMain />
    </Provider>
  );
};

export default ImportTrades;
