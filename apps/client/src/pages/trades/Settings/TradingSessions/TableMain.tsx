import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';

import { QueryKey } from '../../../../enums';
import { getTradingSessions } from '../../../../api/tradingSessions';
import useColumns from './hooks/useColumns';
import TableMain from '../../../../components/table/TableMain';
import { usePaginationState } from '../../../../components/table/providers/Pagination';
import { useFiltersState } from '../../../../components/table/providers/Filters';
import TableMainFooter from '../../../../components/table/TableFooter';

const TradingSessionsTable = () => {
  const { page, rowsPerPage } = usePaginationState();
  const filters = useFiltersState() as { title?: string };

  const { data } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS, page, rowsPerPage, filters.title],
    queryFn: () => getTradingSessions({ page, rowsPerPage, ...filters }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const columns = useColumns();

  return (
    <Stack gap={2}>
      <TableMain data={data?.results || []} columns={columns} />
      <TableMainFooter
        totalItems={data?.totalItems}
        totalPages={data?.totalPages}
        itemsPerPage={data?.itemsPerPage}
        currentPage={data?.currentPage}
        hideRowPerPage
      />
    </Stack>
  );
};

export default TradingSessionsTable;
