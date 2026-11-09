import { format } from 'date-fns';
import { getDefaultStore, useAtomValue } from 'jotai';
import Papa from 'papaparse';
import { useCallback } from 'react';

import { getTrades } from '../../../api/trades';
import { pairsAtom } from '../../../atoms';
import useMainSession from '../../../hooks/useMainSession';
import useSnackbar from '../../../hooks/useSnackbar';
import withCatch from '../../../lib/withCatch';
import type { Pair } from '../../../types/pair';

const useExportTrades = () => {
  const pairsData = useAtomValue(pairsAtom, { store: getDefaultStore() });
  const [mainSession] = useMainSession();

  const { openSnackbar } = useSnackbar();

  const handleExport = useCallback(async () => {
    if (!Array.isArray(pairsData) || pairsData.length === 0 || !mainSession) {
      openSnackbar({
        severity: 'error',
        message: "We couldn't generate the export file. Please try again later.",
      });
      return null;
    }

    const [tradesError, trades] = await withCatch(getTrades({}));

    if (tradesError) {
      openSnackbar({
        severity: 'error',
        message: 'Something went wrong while loading your trades. Try again in a moment.',
      });
      return null;
    }
    if (trades.results.length === 0) {
      openSnackbar({
        severity: 'error',
        message: 'No trades to export yet. Add trades and try again',
      });
      return null;
    }

    const { results } = trades;

    let uniquePairs = [...new Set(results.map((t) => t.pair))];
    let pairs = uniquePairs.reduce(
      (acc, id) => {
        let p = pairsData.find((el) => el.id === id);
        return { ...acc, [id]: p };
      },
      {} as { [key: number]: Pair | undefined }
    );

    let csv = Papa.unparse(
      results.map((t) => ({ ...t, pair: pairs[t.pair]?.pair || t.pair })),
      { delimiter: ',', header: true }
    );

    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let url = window.URL.createObjectURL(blob);

    let tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.setAttribute(
      'download',
      `trades_${mainSession.title}_${format(new Date(mainSession.createdAt), 'dd/MM/yyyy')}.csv`
    );
    tempLink.click();
  }, [pairsData, mainSession]);

  return [handleExport];
};

export default useExportTrades;
