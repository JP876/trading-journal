import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Provider, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import Dropzone from '../../../components/Dropzone';
import { dropzoneStore, dzFilesAtom, type TDzFile } from '../../../components/Dropzone/atoms';
import useRemoveFile from '../../../components/Dropzone/hooks/useRemoveFile';
import { QueryKey } from '../../../enums';
import useSnackbar from '../../../hooks/useSnackbar';
import { handleCSVFile } from '../../../lib/CSVFile';
import { addMultipleTradesDB } from '../../../lib/db/api/trades';
import { queryClient } from '../../../lib/queryClient';
import withCatch from '../../../lib/withCatch';
import type { Pair } from '../../../types/pair';
import type { Trade } from '../../../types/trade';
import type { TradingSession, TradingSessionsResult } from '../../../types/tradingSessions';
import { importTradesStore, parsedFileResultAtom, resetStoreAtom } from './atoms';
import Description from './Description';
import transformTrades from './utils/transformTrades';
import useModal from '../../../hooks/useModal';
import { TradesPageModal } from '../enums';

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
  const { closeModal } = useModal();

  const [loading, setLoading] = useState(false);

  const parsedFileResult = useAtomValue(parsedFileResultAtom);

  const handleImport = async () => {
    let [pairs, mainSession] = await getPairsAndSession();

    if (!pairs || !mainSession || !parsedFileResult) {
      return;
    }

    let trades = transformTrades(parsedFileResult.data, pairs, mainSession);
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
    closeModal(TradesPageModal.IMPORT_TRADES);

    openSnackbar({
      severity: 'success',
      message: "Import successful. We've added your trades to your account.",
    });
  };

  const handleClick = async () => {
    setLoading(true);
    await handleImport();
    setLoading(false);
  };

  return (
    <Button
      disabled={!parsedFileResult}
      startIcon={<CheckIcon />}
      size="small"
      variant="contained"
      loading={loading}
      onClick={handleClick}
    >
      Confirm
    </Button>
  );
};

type TSelectedFileProps = {
  name: string;
  size: number;
  id: string;
};

const SelectedFile = ({ name, size, id }: TSelectedFileProps) => {
  const [removeFile] = useRemoveFile();
  const setParesedFileResult = useSetAtom(parsedFileResultAtom, { store: importTradesStore });

  const handleClick = () => {
    removeFile(id);
    setParesedFileResult(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={[
        (theme) => ({
          border: `1px solid ${theme.palette.grey[200]}`,
          paddingInline: theme.spacing(2),
          paddingBlock: theme.spacing(0.5),
        }),
      ]}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <InsertDriveFileIcon color="primary" />
        <Stack>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="caption">{(size * 0.0009765625).toFixed(1)}kb</Typography>
        </Stack>
      </Stack>
      <IconButton size="small" onClick={handleClick}>
        <ClearIcon color="error" />
      </IconButton>
    </Stack>
  );
};

const SelectedFiles = () => {
  const files = useAtomValue(dzFilesAtom, { store: dropzoneStore });

  if (!files) return null;
  return (
    <Stack gap={0.5}>
      {files.map(({ file, fileId }) => (
        <SelectedFile key={fileId} name={file.name} size={file.size} id={fileId} />
      ))}
    </Stack>
  );
};

const ImportTradesAction = () => {
  const setParesedFileResult = useSetAtom(parsedFileResultAtom, { store: importTradesStore });

  const handleChange = useCallback(async (_: any, tradesData: TDzFile[]) => {
    if (tradesData.length === 0) {
      return;
    }
    let result = await handleCSVFile<Trade>(tradesData[0].file);
    if (result) setParesedFileResult(result);
  }, []);

  return (
    <Stack gap={1} my={1}>
      <Dropzone
        accept=".csv, text/csv"
        onChange={handleChange}
        buttonLabel="Upload file (.csv)"
        label="Drag 'n' drop CSV file"
      />
      <SelectedFiles />
    </Stack>
  );
};

const ImportTradesMain = () => {
  return (
    <Stack gap={2}>
      <Description />
      <ImportTradesAction />
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
    <Provider store={dropzoneStore}>
      <Provider store={importTradesStore}>
        <ImportTradesMain />
      </Provider>
    </Provider>
  );
};

export default ImportTrades;
