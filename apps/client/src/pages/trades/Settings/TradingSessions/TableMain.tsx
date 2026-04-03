import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';

import { QueryKey } from '../../../../enums';
import { getTradingSessions } from '../../../../api/tradingSessions';
import useColumns from './hooks/useColumns';
import TableMain from '../../../../components/table/TableMain';
import ResultsMain from '../../../../components/table/Results';
import PaginationContainer from '../../../../components/table/PaginationContainer';
import { usePaginationState } from '../../../../components/table/providers/Pagination';
import { useFiltersState } from '../../../../components/table/providers/Filters';

const TradingSessionsTable = () => {
  const { page, rowsPerPage } = usePaginationState();
  const filters = useFiltersState() as { title?: string };

  const { data } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS, page, rowsPerPage, filters.title],
    queryFn: () => getTradingSessions({ page, rowsPerPage, ...filters }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const columns = useColumns();

  return (
    <Stack gap={2}>
      <TableMain data={data?.results || []} columns={columns} />

      {data?.currentPage ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ResultsMain currentPage={data.currentPage} itemsPerPage={data.itemsPerPage} totalItems={data.totalItems} />
          <Stack direction="row" alignItems="center" gap={2}>
            <PaginationContainer currentPage={data.currentPage} totalPages={data.totalPages} />
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default TradingSessionsTable;
