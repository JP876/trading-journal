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

import { getTrades } from '../../../api/trades';
import useColumns from './hooks/useColumns';

const TradesTableMain = () => {
  const tradesQuery = useQuery({
    queryKey: ['trades'],
    queryFn: () => getTrades(),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const columns = useColumns();

  const table = useReactTable({
    data: tradesQuery.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility: {} },
  });

  if (tradesQuery.isLoading) {
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
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default TradesTableMain;
