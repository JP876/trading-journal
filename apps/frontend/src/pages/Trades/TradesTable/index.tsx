import { useCallback, useEffect, useRef } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, Updater, useReactTable, VisibilityState } from '@tanstack/react-table';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import useAppStore from '@/store';
import { getTrades } from '@/api/trades';
import useColumns from './hooks/useColumns';
import AddTradeBtn from './AddTradeBtn';

const TradesTableMain = () => {
  const prevVisibilityRef = useRef<VisibilityState>({});
  // const [page, setPage] = useState(1);

  // const queryClient = useQueryClient();
  const tradesColumnVisibility = useAppStore((state) => state.user?.userSettings?.tradesColumnVisibility);

  /* const mutation = useMutation({
    mutationFn: editLoggedInUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  }); */

  const { data, isLoading } = useQuery({
    queryKey: ['trades', 1],
    queryFn: () => getTrades(1),
    placeholderData: keepPreviousData,
  });

  const columns = useColumns();

  const handleColumnVisibility = useCallback((updaterOrValue: Updater<VisibilityState>) => {
    if (typeof updaterOrValue === 'function') {
      // const nextValue = updaterOrValue(prevVisibilityRef.current);
      // mutation.mutate({ userSettings: { tradesColumnVisibility: nextValue } });
    } else {
      // mutation.mutate({ userSettings: { tradesColumnVisibility: updaterOrValue } });
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
    <Stack gap={2}>
      <Stack m={2} direction="row" alignItems="center" justifyContent="space-between">
        <AddTradeBtn />
      </Stack>
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
    </Stack>
  );
};

export default TradesTableMain;
