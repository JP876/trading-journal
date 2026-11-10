import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTable, type Cell_Core, type ColumnDef, type RowData, type TableOptions } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { memo } from 'react';

import { tablePaginationAtom, tableSortingAtom } from './atoms';
import { tableMainFeatures } from './consts';
import TableHeadCell from './TableHeadCell';
import TablePaginationMain from './TablePaginationMain';

type TableMainProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<typeof tableMainFeatures, TData>[];
  hidePageSizeSelect?: boolean;
} & Omit<TableOptions<typeof tableMainFeatures, TData>, 'features' | 'data' | 'columns'>;

type TTableBodyCellProps<TData extends RowData> = {
  cell: Cell_Core<typeof tableMainFeatures, TData>;
  children: React.ReactNode;
};

function TableBodyCell<TData extends RowData>({ cell, children }: TTableBodyCellProps<TData>) {
  return (
    <TableCell key={cell.id} sx={{ width: cell.column.getSize() }}>
      {children}
    </TableCell>
  );
}

function TableMain<TData extends RowData>({
  data,
  columns,
  hidePageSizeSelect,
  ...tableOptions
}: TableMainProps<TData>) {
  // const [columnFilters, setColumnFilters] = useAtom(tableFiltersAtom);
  const [paginationState, setPagination] = useAtom(tablePaginationAtom);
  const [sortingState, setSorting] = useAtom(tableSortingAtom);

  const table = useTable(
    {
      features: tableMainFeatures,
      data: data || [],
      columns: columns,
      state: { pagination: paginationState, sorting: sortingState },
      // onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      manualSorting: true,
      manualPagination: true,
      // manualFiltering: true,
      ...(tableOptions || {}),
    },
    (_) => null,
  );

  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeadCell key={header.id} header={header}>
                  <table.FlexRender header={header} />
                </TableHeadCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getAllCells().map((cell) => (
                  <TableBodyCell key={cell.id} cell={cell}>
                    <table.FlexRender cell={cell} />
                  </TableBodyCell>
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

      {tableOptions?.pageCount && tableOptions?.rowCount ? (
        <table.Subscribe selector={(state) => ({ pagination: state.pagination })}>
          {({ pagination }) => (
            <TablePaginationMain
              table={table}
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              hidePageSizeSelect={hidePageSizeSelect}
            />
          )}
        </table.Subscribe>
      ) : null}
    </TableContainer>
  );
}

export default memo(TableMain) as typeof TableMain;
