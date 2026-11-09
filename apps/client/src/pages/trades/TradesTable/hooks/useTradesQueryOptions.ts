import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { getTrades } from '../../../../api/trades';
import { tableFiltersAtom, tablePaginationAtom } from '../../../../components/table/atoms';
import { QueryKey } from '../../../../enums';
import { tradesTableStore } from '../../store';

const useTradesQueryOptions = () => {
  const { pageIndex: page, pageSize: rowsPerPage } = useAtomValue(tablePaginationAtom, { store: tradesTableStore });
  const filters = useAtomValue(tableFiltersAtom, { store: tradesTableStore });

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
    ],
    queryFn: () => getTrades({ page: page, sortBy: 'id', direction: 'asc', rowsPerPage, ...filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export default useTradesQueryOptions;
