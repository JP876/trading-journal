import { useQuery } from '@tanstack/react-query';
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

import { QueryKey } from '../../../../enums';
import { getTradingSessions } from '../../../../api/tradingSessions';
import useColumns from './hooks/useColumns';
import { Box } from '@mui/material';

const TradingSessionsTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS],
    queryFn: getTradingSessions,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = useColumns();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" my={8}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <TableContainer sx={{ width: '100%' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell colSpan={header.colSpan} key={header.id} sx={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                    )}
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
                  <TableCell key={cell.id} sx={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
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
  );
};

export default TradingSessionsTable;
