import { useMemo } from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

import { TagType } from '@/types/tags';
import { getTags } from '@/api/tags';
import useAppStore from '@/store';
import { menuActionType } from '@/components/MenuActions/types';
import MenuActions from '@/components/MenuActions';

const TagActions = ({ tag }: { tag: TagType }) => {
  const openModal = useAppStore((state) => state.openModal);

  const menuActions: menuActionType[] = [
    {
      id: 'editTag',
      label: 'Edit Tag',
      icon: <EditIcon fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'editTag', data: tag });
        handleClose();
      },
    },
    {
      id: 'deleteTag',
      label: 'Delete Tag',
      icon: <DeleteIcon color="error" fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'deleteTag', data: tag });
        handleClose();
      },
    },
  ];

  return <MenuActions menuActions={menuActions} />;
};

const useColumns = () => {
  return useMemo<ColumnDef<TagType>[]>(() => {
    return [
      { accessorKey: 'name', header: 'Title' },
      {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('color');
          return (
            <Stack direction="row" alignItems="center" gap={1}>
              <Box sx={[{ backgroundColor: value, height: '1.2rem', width: '1.2rem', borderRadius: '50%' }]} />
              <Typography>{value}</Typography>
            </Stack>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        size: 60,
        cell: ({ row }) => <TagActions tag={row.original} />,
      },
    ];
  }, []);
};

const TagsTableMain = () => {
  const { data, isLoading } = useQuery({ queryKey: ['tags'], queryFn: getTags });
  const columns = useColumns();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // defaultColumn: { size: 120 },
  });

  if (isLoading) {
    return (
      <div>
        <h6>Loading...</h6>
      </div>
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
                  <TableCell colSpan={header.colSpan} sx={{ minWidth: `${header.getSize()}px` }} key={header.id}>
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
  );
};

export default TagsTableMain;
