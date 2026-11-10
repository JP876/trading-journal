import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { type Header, type RowData } from '@tanstack/react-table';
import { memo } from 'react';

import type { tableMainFeatures } from './consts';

function getAriaSort(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') return 'ascending';
  if (sortDirection === 'desc') return 'descending';
  return 'none';
}

type TTableHeadCellProps<TData extends RowData> = {
  header: Header<typeof tableMainFeatures, TData, unknown>;
  children: React.ReactNode;
};

function TableHeadCell<TData extends RowData>({ header, children }: TTableHeadCellProps<TData>) {
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
          {children}
        </TableSortLabel>
      ) : (
        <Typography variant="subtitle2">{children}</Typography>
      )}
    </TableCell>
  );
}

export default memo(TableHeadCell) as typeof TableHeadCell;
