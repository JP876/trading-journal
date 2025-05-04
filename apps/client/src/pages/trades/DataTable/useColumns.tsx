import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Files, Info, MoreVertical, Trash, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { TradeDirection, TradeType, TradeDialogListIds, TradeResult } from '../types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import useAppStore from '@/store';

const ValueNotFound = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center', className)}>
      <X className=" w-5 h-5" />
    </div>
  );
};

const TradeActions = ({ trade }: { trade: TradeType }) => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        disabled={!Array.isArray(trade?.files) || trade?.files?.length === 0}
        onClick={() => openModal({ id: TradeDialogListIds.TRADE_FILES, data: trade })}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Open files dialog</span>
        <Files className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => openModal({ id: TradeDialogListIds.TRADE_DETAILS, data: trade })}>
            <Info /> Trade Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openModal({ id: TradeDialogListIds.EDIT_TRADE, data: trade })}>
            <Edit /> Edit Trade
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => openModal({ id: TradeDialogListIds.DELETE_TRADE, data: trade })}
          >
            <Trash /> Delete Trade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const useColumns = () => {
  return useMemo(() => {
    return [
      { accessorKey: 'pair', header: 'Pair', enableHiding: false },
      {
        accessorKey: 'direction',
        header: () => <div>Direction</div>,
        cell: ({ row }) => {
          const value: TradeDirection | undefined = row.getValue('direction');
          if (!value) return <ValueNotFound />;

          return (
            <div className="flex items-center">
              <Badge
                variant="outline"
                className={cn(
                  ' w-12 text-black',
                  value === TradeDirection.BUY && ' bg-green-200',
                  value === TradeDirection.SELL && 'bg-red-200'
                )}
              >
                {value}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'result',
        header: 'Result',
        cell: ({ row }) => {
          const value: TradeResult | undefined = row.getValue('result');
          if (!value) return <ValueNotFound />;

          return (
            <div className="flex items-center">
              <Badge
                variant="outline"
                className={cn(
                  ' w-12 text-black',
                  value === TradeResult.WIN && ' bg-green-200',
                  value === TradeResult.LOSS && 'bg-red-200',
                  value === TradeResult.BE && 'bg-gray-200'
                )}
              >
                {value}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'takeProfit',
        header: 'TP',
        cell: ({ row }) => {
          const value = row.getValue('takeProfit');
          if (!value) return <ValueNotFound />;
          return value;
        },
      },
      {
        accessorKey: 'stopLoss',
        header: 'SL',
        cell: ({ row }) => {
          const value = row.getValue('stopLoss');
          if (!value) return <ValueNotFound />;
          return value;
        },
      },
      { accessorKey: 'pl', header: 'Profit/loss' },
      {
        accessorKey: 'openDate',
        header: 'Open Date',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('openDate');
          if (!value) return <ValueNotFound className="justify-start" />;
          return format(new Date(value), 'dd/MM/yy HH:mm');
        },
      },
      {
        accessorKey: 'closeDate',
        header: 'End date',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('closeDate');
          if (!value) return <ValueNotFound className="justify-start" />;
          return format(new Date(value), 'dd/MM/yy HH:mm');
        },
      },
      { accessorKey: 'comment', header: 'Comment' },
      {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => <TradeActions trade={row.original} />,
        enableHiding: false,
      },
    ];
  }, []) as ColumnDef<TradeType>[];
};

export default useColumns;
