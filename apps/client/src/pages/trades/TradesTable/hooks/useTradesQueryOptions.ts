import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import { usePaginationState } from '../../../../components/table/providers/Pagination';
import { useFiltersState } from '../../../../components/table/providers/Filters';
import { getTrades } from '../../../../api/trades';
import { QueryKey } from '../../../../enums';
import type { Result } from '../../../../types/trade';

const useTradesQueryOptions = () => {
  const { page, rowsPerPage } = usePaginationState();
  const filters = useFiltersState() as {
    pair?: number;
    result?: Result;
    openDate?: string;
    closeDate?: string;
    tags?: string;
  };

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
    queryFn: () => getTrades({ page, rowsPerPage, ...filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export default useTradesQueryOptions;
