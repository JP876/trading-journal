import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import useAppStore from '@/store';
import { getTrades, tradesLimit } from '@/api/trades';
import useColumns from './hooks/useColumns';

const TradesTableMain = () => {
  const [page, setPage] = useState(1);
  const tradesColumnVisibility = useAppStore((state) => state.user?.userSettings?.tradesColumnVisibility);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['trades', page],
    queryFn: () => getTrades(page),
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
                  return (
                    <TableCell key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

      {data?.count && data.count > tradesLimit ? (
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Pagination
            variant="outlined"
            shape="rounded"
            count={Math.ceil(data.count / tradesLimit)}
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      ) : null}
    </Stack>
  );
};

export default TradesTableMain;
