import { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import NotFoundValue from '@/components/NotFoundValue';
import { AccountType } from '@/types/accounts';
import { getAccounts } from '@/api/accounts';
import useAppStore from '@/store';
import { menuActionType } from '@/components/MenuActions/types';
import MenuActions from '@/components/MenuActions';

const AccountActions = ({ account }: { account: AccountType }) => {
  const openModal = useAppStore((state) => state.openModal);

  const menuActions = [
    {
      id: 'editAccount',
      label: 'Edit Account',
      icon: <EditIcon fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'editAccount', data: account });
        handleClose();
      },
    },
    {
      id: 'deleteAccount',
      label: 'Delete Account',
      menuItemProps: {
        disabled: account?.isMain,
      },
      icon: <DeleteIcon color="error" fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'deleteAccount', data: account });
        handleClose();
      },
    },
  ] as menuActionType[];

  return <MenuActions menuActions={menuActions} />;
};

const useColumns = () => {
  return useMemo<ColumnDef<AccountType>[]>(() => {
    return [
      { accessorKey: 'title', header: 'Title' },
      {
        accessorKey: 'isMain',
        header: 'Main',
        cell: ({ row }) => {
          const value: boolean | undefined = row.getValue('isMain');
          return value ? <CheckIcon fontSize="small" color="success" /> : <CloseIcon fontSize="small" />;
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('description');
          if (!value) return <NotFoundValue />;
          return value;
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => <AccountActions account={row.original} />,
      },
    ];
  }, []);
};

const AccountsTable = () => {
  const { data, isLoading } = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });
  const columns = useColumns();

  const accountsData = useMemo<AccountType[] | []>(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => +Boolean(b?.isMain) - +Boolean(a?.isMain));
  }, [data]);

  const table = useReactTable({
    data: accountsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
  );
};

export default AccountsTable;
