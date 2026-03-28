import { useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Header,
  type Row,
  type TableOptions,
} from '@tanstack/react-table';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

type TableMainProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  tableOptions?: TableOptions<TData>;
};

function TableMain<TData = any>({ data, columns, tableOptions }: TableMainProps<TData>) {
  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    ...(tableOptions || {}),
  });

  const renderHeader = useCallback((header: Header<TData, unknown>) => {
    const value = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());

    if (!header.column.getCanSort()) {
      return (
        <TableCell key={header.id} sx={{ width: header.getSize() }}>
          {value}
        </TableCell>
      );
    }

    return (
      <TableCell sx={{ width: header.getSize() }} key={header.id}>
        {value}
      </TableCell>
    );
  }, []);

  const renderBodyRows = useCallback((row: Row<TData>) => {
    return (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} sx={{ width: cell.column.getSize() }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }, []);

  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>{headerGroup.headers.map(renderHeader)}</TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(renderBodyRows)
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
}

export default TableMain;
