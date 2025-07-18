import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';

import { TradeDirection, TradeResult, TradeType } from '@/types/trades';
import NotFoundValue from '@/components/NotFoundValue';
import MenuActions from '@/components/MenuActions';
import { menuActionType } from '@/components/MenuActions/types';
import useAppStore from '@/store';

const TradeActions = ({ trade }: { trade: TradeType }) => {
  const openModal = useAppStore((state) => state.openModal);

  const menuActions = [
    {
      id: 'editTrade',
      label: 'Edit Trade',
      icon: <EditIcon fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'editTrade', data: trade });
        handleClose();
      },
    },
    {
      id: 'deleteTrade',
      label: 'Delete Trade',
      icon: <DeleteIcon color="error" fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'deleteTrade', data: trade });
        handleClose();
      },
    },
  ] as menuActionType[];

  return <MenuActions menuActions={menuActions} />;
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
          if (!value) return <NotFoundValue />;

          return (
            <Chip
              label={value}
              size="small"
              sx={[
                { textTransform: 'uppercase', width: '3.6rem' },
                value === TradeDirection.BUY && {
                  backgroundColor: (theme) => theme.palette.success.light,
                  color: (theme) => theme.palette.common.white,
                },
                value === TradeDirection.SELL && {
                  backgroundColor: (theme) => theme.palette.error.main,
                  color: (theme) => theme.palette.common.white,
                },
              ]}
            />
          );
        },
      },
      {
        accessorKey: 'result',
        header: 'Result',
        cell: ({ row }) => {
          const value: TradeResult | undefined = row.getValue('result');
          if (!value) return <NotFoundValue />;

          return (
            <Chip
              label={value}
              size="small"
              sx={[
                { textTransform: 'uppercase', width: '3.6rem' },
                value === TradeResult.WIN && {
                  backgroundColor: (theme) => theme.palette.success.light,
                  color: (theme) => theme.palette.common.white,
                },
                value === TradeResult.LOSS && {
                  backgroundColor: (theme) => theme.palette.error.main,
                  color: (theme) => theme.palette.common.white,
                },
              ]}
            />
          );
        },
      },
      {
        accessorKey: 'takeProfit',
        header: 'TP',
        cell: ({ row }) => {
          const value = row.getValue('takeProfit');
          if (!value) return <NotFoundValue />;
          return value;
        },
      },
      {
        accessorKey: 'stopLoss',
        header: 'SL',
        cell: ({ row }) => {
          const value = row.getValue('stopLoss');
          if (!value) return <NotFoundValue />;
          return value;
        },
      },
      {
        accessorKey: 'pl',
        header: 'Profit/Loss',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('pl');
          if (!value) return <NotFoundValue />;
          return value;
        },
      },
      {
        accessorKey: 'openDate',
        header: 'Open Date',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('openDate');
          if (!value) return <NotFoundValue />;
          return format(new Date(value), 'dd/MM/yy HH:mm');
        },
      },
      {
        accessorKey: 'closeDate',
        header: 'End date',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('closeDate');
          if (!value) return <NotFoundValue />;
          return format(new Date(value), 'dd/MM/yy HH:mm');
        },
      },
      {
        accessorKey: 'comment',
        header: 'Comment',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('comment');
          if (!value) return <NotFoundValue />;
          return value;
        },
      },
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
