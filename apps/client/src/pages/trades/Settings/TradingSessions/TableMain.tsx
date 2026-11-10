import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { getTradingSessions } from '../../../../api/tradingSessions';
import { tableFiltersAtom, tablePaginationAtom } from '../../../../components/table/atoms';
import TableMain from '../../../../components/table/TableMain';
import { QueryKey } from '../../../../enums';
import useColumns from './hooks/useColumns';

const TradingSessionsTable = () => {
  const { pageIndex: page, pageSize: rowsPerPage } = useAtomValue(tablePaginationAtom);
  const filters = useAtomValue<{ title?: string }>(tableFiltersAtom);

  const { data } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS, page, rowsPerPage, filters.title],
    queryFn: () => getTradingSessions({ page, rowsPerPage, ...filters }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const columns = useColumns();

  return (
    <TableMain
      data={data?.results || []}
      columns={columns}
      pageCount={data?.totalPages}
      rowCount={data?.totalItems}
      hidePageSizeSelect
    />
  );
};

export default TradingSessionsTable;
