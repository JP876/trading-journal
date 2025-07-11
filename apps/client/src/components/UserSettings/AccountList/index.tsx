import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { getAccounts } from '@/api/accounts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ValueNotFound from '@/components/ui/ValueNotFound';
import { AccountType } from '@/pages/trades/Accounts/types';
import useAppStore from '@/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreVertical, Trash } from 'lucide-react';

const AccountActions = ({ account }: { account: AccountType }) => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openModal({ id: 'editAccount', data: account })}>
            <Edit /> Edit Account
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => openModal({ id: 'deleteAccount', data: account })}>
            <Trash /> Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const useColumns = () => {
  return useMemo(() => {
    return [
      { accessorKey: 'title', header: 'Title' },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('description');
          if (!value) return <ValueNotFound />;
          return value;
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => <AccountActions account={row.original} />,
      },
    ];
  }, []) as ColumnDef<AccountType>[];
};

const AccountList = () => {
  const { data, isLoading } = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });
  const columns = useColumns();

  const table = useReactTable({
    data: data || [],
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
    </div>
  );
};

export default AccountList;
