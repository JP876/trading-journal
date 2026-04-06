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
import { TradesPageModal } from '../../enums';
import ClampedTextContainer from '../../../../components/ClampedTextContainer';
import checkBrightness from '../../../../lib/checkBrighness';

const TradeActions = ({ trade }: { trade: Trade }) => {
  const { openModal } = useModal();

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <MenuActions>
        <MenuActions.Item
          label="Edit trade"
          icon={<EditIcon fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.EDIT_TRADE, trade);
            handleClose();
          }}
        />
        <MenuActions.Item
          label="Delete trade"
          icon={<DeleteIcon color="error" fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.DELETE_TRADE, trade);
            handleClose();
          }}
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
          return <Typography variant="body2">{value.pair}</Typography>;
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
                  <Typography variant="caption" textAlign="center" lineHeight=".8rem">
                    {value}
                  </Typography>
                </Stack>
              }
              size="small"
              sx={[
                { textTransform: 'uppercase', width: '5.4rem' },
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
              variant="body2"
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
          const value: number | undefined = row.original.stopLoss;
          const result: Result | undefined = row.original.result;

          if (!value) return <NotFoundValue />;

          return (
            <Typography
              variant="body2"
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
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          const value = row.original.tags;
          if (!Array.isArray(value) || value.length === 0) {
            return <NotFoundValue />;
          }

          return (
            <Stack direction="row" alignItems="center" gap={1}>
              {value.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.title}
                  sx={(theme) => ({
                    backgroundColor: tag.color,
                    height: '1.6rem',
                    color: checkBrightness(tag.color) ? theme.palette.common.white : theme.palette.common.black,
                  })}
                />
              ))}
            </Stack>
          );
        },
      },
      {
        accessorKey: 'openDate',
        header: 'Open',
        cell: ({ row }) => {
          const value: string | undefined = row.original.openDate;
          if (!value) return <NotFoundValue />;
          return <Typography variant="body2">{format(new Date(value), 'dd/MM/yy HH:mm')}</Typography>;
        },
      },
      {
        accessorKey: 'closeDate',
        header: 'Close',
        cell: ({ row }) => {
          const value: string | undefined = row.original.closeDate;
          if (!value) return <NotFoundValue />;
          return <Typography variant="body2">{format(new Date(value), 'dd/MM/yy HH:mm')}</Typography>;
        },
      },
      {
        accessorKey: 'comment',
        header: 'Comment',
        cell: ({ row }) => {
          const value: string | undefined = row.original.comment;
          if (!value) return <NotFoundValue />;
          return <ClampedTextContainer variant="body2">{value}</ClampedTextContainer>;
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
