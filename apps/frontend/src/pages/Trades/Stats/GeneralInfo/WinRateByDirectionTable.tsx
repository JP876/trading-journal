import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { TradeDirection, WinRateByDirection } from '@/types/trades';
import { useMemo } from 'react';
import NotFoundValue from '@/components/NotFoundValue';

type WinRateByDirectionTableProps = {
  data: WinRateByDirection[] | [];
};

const useColumns = () => {
  return useMemo<ColumnDef<WinRateByDirection>[]>(() => {
    return [
      {
        accessorKey: '_id',
        header: 'Direction',
        cell: ({ row }) => {
          const value: TradeDirection | undefined = row.getValue('_id');
          if (!value) return <NotFoundValue />;
          const valueIcon =
            value === TradeDirection.BUY ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />;

          return (
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              sx={[
                value === TradeDirection.BUY && ((theme) => ({ color: theme.palette.success.light })),
                value === TradeDirection.SELL && ((theme) => ({ color: theme.palette.error.main })),
              ]}
            >
              {valueIcon}
              <Typography variant="body2" sx={[{ textTransform: 'uppercase' }]}>
                {value}
              </Typography>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'win',
        header: 'WIN',
        cell: ({ row }) => {
          const value: TradeDirection | undefined = row.getValue('win');
          if (!value) return <NotFoundValue />;

          return (
            <Typography
              variant="body2"
              sx={[{ textTransform: 'uppercase' }, (theme) => ({ color: theme.palette.success.light })]}
            >
              {value}
            </Typography>
          );
        },
      },
      { accessorKey: 'be', header: 'BE' },
      {
        accessorKey: 'loss',
        header: 'LOSS',
        cell: ({ row }) => {
          const value: TradeDirection | undefined = row.getValue('loss');
          if (!value) return <NotFoundValue />;

          return (
            <Typography
              variant="body2"
              sx={[{ textTransform: 'uppercase' }, (theme) => ({ color: theme.palette.error.main })]}
            >
              {value}
            </Typography>
          );
        },
      },
    ];
  }, []);
};

const WinRateByDirectionTable = ({ data }: WinRateByDirectionTableProps) => {
  const columns = useColumns();

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalWinRate = useMemo(() => {
    return data.reduce(
      (acc, el) => {
        return { win: el.win + acc?.win, be: el.be + acc.be, loss: el.loss + acc.loss };
      },
      { win: 0, be: 0, loss: 0 }
    );
  }, [data]);

  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const value = header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext());

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
          <TableRow>
            <TableCell />
            <TableCell sx={(theme) => ({ color: theme.palette.success.light })}>{totalWinRate.win}</TableCell>
            <TableCell>{totalWinRate.be}</TableCell>
            <TableCell sx={(theme) => ({ color: theme.palette.error.main })}>{totalWinRate.loss}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WinRateByDirectionTable;
