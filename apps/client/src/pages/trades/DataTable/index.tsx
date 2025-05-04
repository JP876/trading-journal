import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, Updater, useReactTable, VisibilityState } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useColumns from './useColumns';
import { getTrades, tradesLimit } from '@/api/trades';
import { Separator } from '@/components/ui/separator';
import TradesPagination from './TradesPagination';
import AddTradeButton from '../AddTradeButton';
import VisibilityColumnMenu from './VisibilityColumnMenu';
import { editLoggedInUser } from '@/api/user';
import useAppStore from '@/store';

const TradesDataTable = () => {
  const prevVisibilityRef = useRef<VisibilityState>({});
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const tradesColumnVisibility = useAppStore((state) => state.user?.userSettings?.tradesColumnVisibility);

  const mutation = useMutation({
    mutationFn: editLoggedInUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['trades', page],
    queryFn: () => getTrades(page),
    placeholderData: keepPreviousData,
  });

  const columns = useColumns();

  const handleColumnVisibility = useCallback((updaterOrValue: Updater<VisibilityState>) => {
    if (typeof updaterOrValue === 'function') {
      const nextValue = updaterOrValue(prevVisibilityRef.current);
      mutation.mutate({ userSettings: { tradesColumnVisibility: nextValue } });
    } else {
      mutation.mutate({ userSettings: { tradesColumnVisibility: updaterOrValue } });
    }
  }, []);

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: handleColumnVisibility,
    state: { columnVisibility: tradesColumnVisibility || {} },
  });

  useEffect(() => {
    prevVisibilityRef.current = tradesColumnVisibility || {};
  }, [tradesColumnVisibility]);

  if (isLoading) {
    return (
      <div>
        <h6>Loading...</h6>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center">
        <AddTradeButton />
        <VisibilityColumnMenu table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

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
        <Separator />
        <div className="p-2 w-full">
          <TradesPagination setPage={setPage} totalCount={data?.count} perPageCount={tradesLimit} page={page} />
        </div>
      </div>
    </div>
  );
};

export default memo(TradesDataTable);
