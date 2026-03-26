import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { getTrades } from '../../../api/trades';
import useColumns from './hooks/useColumns';
import { usePaginationState } from '../../../components/table/providers/Pagination';
import PaginationMain from '../../../components/table/PaginationMain';
import RowsPerPageSelect from '../../../components/table/RowsPerPageSelect';
import ResultsMain from '../../../components/table/Results';
import { useFiltersState } from '../../../components/table/providers/Filters';
import type { Result } from '../../../types/trade';
import { QueryKey } from '../../../enums';

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

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility: {} },
  });

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" my={8}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const value = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext());

                  if (!header.column.getCanSort()) {
                    return (
                      <TableCell key={header.id} sx={{ maxWidth: header.getSize() }}>
                        {value}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell sx={{ maxWidth: header.getSize() }} key={header.id}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow sx={{ height: '3rem' }}>
                <TableCell colSpan={columns.length} sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography variant="body1">No results.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
