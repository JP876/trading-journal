import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Chip from '@mui/material/Chip';

import { TradeDirection, TradeResult, TradeType } from '@/types/trades';
import NotFoundValue from '@/components/NotFoundValue';
import MenuActions from '@/components/MenuActions';
import { menuActionType } from '@/components/MenuActions/types';
import useAppStore from '@/store';

const TradeActions = ({ trade }: { trade: TradeType }) => {
  const openModal = useAppStore((state) => state.openModal);

  const menuActions: menuActionType[] = [
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
  ];

  return <MenuActions menuActions={menuActions} />;
};

const useColumns = () => {
  return useMemo<ColumnDef<TradeType>[]>(() => {
    return [
      { accessorKey: 'pair', header: 'Pair', enableHiding: false, enableSorting: false },
      {
        accessorKey: 'direction',
        header: () => <div>Direction</div>,
        cell: ({ row }) => {
          const value: TradeDirection | undefined = row.getValue('direction');
          if (!value) return <NotFoundValue />;

          const valueIcon =
            value === TradeDirection.BUY ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />;

          return (
            <Chip
              label={
                <Stack direction="row" alignItems="center" gap={0.5}>
                  {valueIcon}
                  <Typography variant="caption">{value}</Typography>
                </Stack>
              }
              size="small"
              sx={[
                { textTransform: 'uppercase', width: '4.4rem' },
                value === TradeDirection.BUY &&
                  ((theme) => ({
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.background.default,
                  })),
                value === TradeDirection.SELL &&
                  ((theme) => ({
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.background.default,
                  })),
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
                (_) => ({ textTransform: 'uppercase', width: '3.6rem' }),
                value === TradeResult.WIN &&
                  ((theme) => ({
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.background.default,
                  })),
                value === TradeResult.LOSS &&
                  ((theme) => ({
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.background.default,
                  })),
              ]}
            />
          );
        },
      },
      {
        accessorKey: 'takeProfit',
        header: 'TP',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('takeProfit');
          const result: TradeResult | undefined = row.getValue('result');

          if (!value) return <NotFoundValue />;

          return (
            <Typography
              sx={[
                result === TradeResult.WIN &&
                  ((theme) => ({
                    color: theme.palette.success.light,
                    fontWeight: 600,
                  })),
              ]}
            >
              {value}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'stopLoss',
        header: 'SL',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('stopLoss');
          const result: TradeResult | undefined = row.getValue('result');

          if (!value) return <NotFoundValue />;

          return (
            <Typography
              sx={[
                result === TradeResult.LOSS &&
                  ((theme) => ({
                    color: theme.palette.error.light,
                    fontWeight: 600,
                  })),
              ]}
            >
              {value}
            </Typography>
          );
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
  }, []);
};

export default useColumns;
