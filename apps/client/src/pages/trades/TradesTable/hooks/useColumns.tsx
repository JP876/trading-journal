import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import type { Direction, Result, Trade } from '../../../../types/trade';
import type { Pair } from '../../../../types/pair';
import MenuActions from '../../../../components/MenuActions';
import useModal from '../../../../hooks/useModal';
import NotFoundValue from '../../../../components/NotFoundValue';

const TradeActions = ({ trade }: { trade: Trade }) => {
  const { openModal } = useModal();

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <MenuActions>
        <MenuActions.Item
          label="Edit trade"
          icon={<EditIcon fontSize="small" />}
          onClick={() => openModal('editTrade', trade)}
        />
        <MenuActions.Item
          label="Delete trade"
          icon={<DeleteIcon color="error" fontSize="small" />}
          onClick={() => openModal('deleteTrade', trade)}
        />
      </MenuActions>
    </Stack>
  );
};

const useColumns = () => {
  return useMemo<ColumnDef<Trade>[]>(() => {
    return [
      {
        accessorKey: 'pair',
        header: 'Pair',
        enableHiding: false,
        size: 140,
        cell: ({ row }) => {
          const value: Pair | null = row.getValue('pair');
          if (!value) return <NotFoundValue />;
          return <Typography>{value.pair}</Typography>;
        },
      },
      {
        accessorKey: 'direction',
        size: 120,
        header: () => <div>Direction</div>,
        cell: ({ row }) => {
          const value: Direction | undefined = row.getValue('direction');
          if (!value) return <NotFoundValue />;

          const valueIcon =
            value === 'long' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />;

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
                value === 'long' &&
                  ((theme) => ({
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.background.default,
                  })),
                value === 'short' &&
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
        size: 120,
        cell: ({ row }) => {
          const value: Result | undefined = row.getValue('result');
          if (!value) return <NotFoundValue />;

          return (
            <Chip
              label={value}
              size="small"
              sx={[
                (_) => ({ textTransform: 'uppercase', width: '3.6rem' }),
                value === 'win' &&
                  ((theme) => ({
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.background.default,
                  })),
                value === 'loss' &&
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
        size: 80,
        header: 'TP',
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('takeProfit');
          const result: Result | undefined = row.getValue('result');

          if (!value) return <NotFoundValue />;

          return (
            <Typography
              sx={[
                result === 'win' &&
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
        size: 80,
        cell: ({ row }) => {
          const value: string | undefined = row.getValue('stopLoss');
          const result: Result | undefined = row.getValue('result');

          if (!value) return <NotFoundValue />;

          return (
            <Typography
              sx={[
                result === 'loss' &&
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
        size: 80,
        cell: ({ row }) => <TradeActions trade={row.original} />,
        enableHiding: false,
      },
    ];
  }, []);
};

export default useColumns;
