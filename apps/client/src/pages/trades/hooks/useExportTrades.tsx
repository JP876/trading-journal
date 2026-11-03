import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Papa from 'papaparse';
import { useCallback } from 'react';

import { getPairs } from '../../../api/pairs';
import { getTrades } from '../../../api/trades';
import { QueryKey } from '../../../enums';
import useMainSession from '../../../hooks/useMainSession';
import withCatch from '../../../lib/withCatch';
import type { Pair } from '../../../types/pair';

const useExportTrades = () => {
  const { data: pairsData } = useQuery({
    queryKey: [QueryKey.PAIRS],
    queryFn: () => getPairs(),
    staleTime: Infinity,
  });
  const [mainSession] = useMainSession();

  const handleExport = useCallback(async () => {
    if (!Array.isArray(pairsData) || pairsData.length === 0 || !mainSession) {
      return null;
    }

    let [error, tradesData] = await withCatch(getTrades({}));
    if (error || !tradesData?.results) {
      console.error(error);
      return null;
    }

    let { results } = tradesData;

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
