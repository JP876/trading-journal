import { keepPreviousData, useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { getTrades } from '../../../api/trades';
import useColumns from './hooks/useColumns';
import { usePaginationState } from '../../../components/table/providers/Pagination';
import PaginationMain from '../../../components/table/PaginationMain';
import RowsPerPageSelect from '../../../components/table/RowsPerPageSelect';
import ResultsMain from '../../../components/table/Results';
import { useFiltersState } from '../../../components/table/providers/Filters';
import type { Result } from '../../../types/trade';
import { QueryKey } from '../../../enums';
import TableMain from '../../../components/table/TableMain';

const TradesTableMain = () => {
  const { page, rowsPerPage } = usePaginationState();
  const filters = useFiltersState() as { pair?: number; result?: Result };

  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.TRADES, page, rowsPerPage, filters.pair, filters.result],
    queryFn: () => getTrades({ page, rowsPerPage, ...filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = useColumns();

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" my={8}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <TableMain data={data?.results || []} columns={columns} />

      {data?.currentPage ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ResultsMain currentPage={data.currentPage} itemsPerPage={data.itemsPerPage} totalItems={data.totalItems} />
          <Stack direction="row" alignItems="center" gap={2}>
            <RowsPerPageSelect itemsPerPage={data.itemsPerPage} />
            <PaginationMain currentPage={data.currentPage} totalPages={data.totalPages} />
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default TradesTableMain;
