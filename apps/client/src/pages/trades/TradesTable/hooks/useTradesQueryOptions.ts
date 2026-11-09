import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { getTrades } from '../../../../api/trades';
import { tableFiltersAtom, tablePaginationAtom } from '../../../../components/table/atoms';
import { QueryKey } from '../../../../enums';
import type { Result } from '../../../../types/trade';
import { tradesTableStore } from '../../store';

const useTradesQueryOptions = () => {
  const { page, rowsPerPage } = useAtomValue(tablePaginationAtom, { store: tradesTableStore });
  const filters = useAtomValue<{
    pair?: number;
    result?: Result;
    openDate?: string;
    closeDate?: string;
    tags?: string;
  }>(tableFiltersAtom, { store: tradesTableStore });

  return queryOptions({
    queryKey: [
      QueryKey.TRADES,
      page,
      rowsPerPage,
      filters.pair,
      filters.result,
      filters.openDate,
      filters.closeDate,
      filters.tags,
      'closeDate',
      'asc',
    ],
    queryFn: () => getTrades({ page, rowsPerPage, sortBy: 'closeDate', direction: 'asc', ...filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export default useTradesQueryOptions;
