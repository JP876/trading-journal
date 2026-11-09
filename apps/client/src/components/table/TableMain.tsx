import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TableSortLabel } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTable, type ColumnDef, type RowData, type TableOptions } from '@tanstack/react-table';
import { memo } from 'react';

import { tableMainFeatures } from './consts';

type TableMainProps<TData extends RowData> = {
  data: TData[];
  columns: ColumnDef<typeof tableMainFeatures, TData>[];
  tableOptions?: TableOptions<typeof tableMainFeatures, TData>;
};

function getAriaSort(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') return 'ascending';
  if (sortDirection === 'desc') return 'descending';
  return 'none';
}

function TableMain<TData extends RowData>({ data, columns, tableOptions }: TableMainProps<TData>) {
  const table = useTable({
    features: tableMainFeatures,
    data: data || [],
    columns: columns,
    ...(tableOptions || {}),
  });

  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted();

                return (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sortDirection={sortDirection || false}
                    aria-sort={getAriaSort(sortDirection || false)}
                    data-sort={sortDirection || undefined}
                    sx={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <TableSortLabel
                        active={!!sortDirection}
                        direction={sortDirection || undefined}
                        onClick={header.column.getToggleSortingHandler()}
                        IconComponent={ArrowDownwardIcon}
                      >
                        <table.FlexRender header={header} />
                      </TableSortLabel>
                    ) : (
                      <Typography variant="subtitle2">
                        <table.FlexRender header={header} />
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ width: cell.column.getSize() }}>
                    <table.FlexRender cell={cell} />
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
}

export default memo(TableMain) as typeof TableMain;
