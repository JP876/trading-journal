import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useAtomValue } from 'jotai';

import useAppStore from '@/store';
import { getTrades, tradesLimit } from '@/api/trades';
import useColumns from './hooks/useColumns';
import { filtersAtom, pageAtom, rowsPerPageAtom } from '@/components/table/tableAtoms';
import TableRowsPerPageSelect from '@/components/table/pagination/TableRowsPerPageSelect';
import TablePaginationMain from '@/components/table/pagination/TablePaginationMain';
import TableResults from '@/components/table/pagination/TableResults';
import useTableSort from '@/components/table/hooks/useTableSort';

const TradesTableMain = () => {
  const page = useAtomValue(pageAtom);
  const rowsPerPage = useAtomValue(rowsPerPageAtom);
  const [orderBy, handleOrderBy] = useTableSort();

  const filters = useAtomValue(filtersAtom);
  const [debouncedFilters] = useDebounce(filters, 200);

  const tradesColumnVisibility = useAppStore((state) => state.user?.userSettings?.tradesColumnVisibility);

  const { data, isLoading } = useQuery({
    queryKey: ['trades', page, rowsPerPage, debouncedFilters, orderBy],
    queryFn: () => getTrades({ page, rowsPerPage, ...debouncedFilters, sort: orderBy }),
    placeholderData: keepPreviousData,
  });

  const columns = useColumns();

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility: tradesColumnVisibility || {} },
  });

  if (isLoading) {
    return (
      <div>
        <h6>Loading...</h6>
      </div>
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
                    return <TableCell key={header.id}>{value}</TableCell>;
                  }

                  return (
                    <TableCell key={header.id}>
                      <TableSortLabel
                        active={orderBy.includes(header.id)}
                        direction={orderBy.startsWith('-') ? 'desc' : 'asc'}
                        onClick={(e) => handleOrderBy(e, header.id)}
                      >
                        {value}
                      </TableSortLabel>
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
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <TableResults count={data?.count} totalCount={data?.totalCount} />
        {data?.count && data?.count > tradesLimit ? (
          <Stack direction="row" alignItems="center" gap={3}>
            <TableRowsPerPageSelect />
            <TablePaginationMain count={data.count} />
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default TradesTableMain;
