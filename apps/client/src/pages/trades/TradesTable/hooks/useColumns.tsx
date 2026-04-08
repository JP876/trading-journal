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

import type { Trade } from '../../../../types/trade';
import MenuActions from '../../../../components/MenuActions';
import useModal from '../../../../hooks/useModal';
import NotFoundValue from '../../../../components/NotFoundValue';
import { TradesPageModal } from '../../enums';
import ClampedTextContainer from '../../../../components/ClampedTextContainer';
import TradeTagsCell from '../TradeTagsCell';

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
          const { pair } = row.original;
          if (!pair) return <NotFoundValue />;
          return <Typography variant="body2">{pair.pair}</Typography>;
        },
      },
      {
        accessorKey: 'direction',
        size: 120,
        header: () => <div>Direction</div>,
        cell: ({ row }) => {
          const { direction } = row.original;
          if (!direction) return <NotFoundValue />;

          const valueIcon =
            direction === 'long' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />;

          return (
            <Chip
              label={
                <Stack direction="row" alignItems="center" gap={0.5}>
                  {valueIcon}
                  <Typography variant="caption" textAlign="center" lineHeight=".8rem">
                    {direction}
                  </Typography>
                </Stack>
              }
              size="small"
              sx={[
                { textTransform: 'uppercase', width: '5.4rem' },
                direction === 'long' &&
                  ((theme) => ({
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.background.default,
                  })),
                direction === 'short' &&
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
          const { result, closedBy, closedAt, takeProfit, stopLoss } = row.original;

          if (!result) return <NotFoundValue />;

          const info = (() => {
            let by, amount;
            switch (result) {
              case 'be':
                return { label: result };
              case 'loss':
                by = closedBy === 'tp/sl' ? 'SL' : 'U';
                amount = closedBy === 'tp/sl' ? stopLoss : closedAt;
                return { label: `${result} ${by}/${amount}` };
              case 'win':
                by = closedBy === 'tp/sl' ? 'TP' : 'U';
                amount = closedBy === 'tp/sl' ? takeProfit : closedAt;
                return { label: `${result} ${by}/${amount}` };
            }
          })();

          return (
            <Chip
              label={info.label}
              size="small"
              sx={[
                (_) => ({ textTransform: 'uppercase', minWidth: '5.4rem' }),
                result === 'win' &&
                  ((theme) => ({
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.background.default,
                  })),
                result === 'loss' &&
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
        size: 60,
        header: 'TP',
        cell: ({ row }) => {
          const { takeProfit, result, closedBy } = row.original;

          if (!takeProfit) return <NotFoundValue />;

          return (
            <Typography
              variant="body2"
              sx={[
                result === 'win' &&
                  closedBy === 'tp/sl' &&
                  ((theme) => ({
                    color: theme.palette.success.light,
                    fontWeight: 600,
                  })),
              ]}
            >
              {takeProfit}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'stopLoss',
        header: 'SL',
        size: 60,
        cell: ({ row }) => {
          const { stopLoss, result, closedBy } = row.original;

          if (!stopLoss) return <NotFoundValue />;

          return (
            <Typography
              variant="body2"
              sx={[
                result === 'loss' &&
                  closedBy === 'tp/sl' &&
                  ((theme) => ({
                    color: theme.palette.error.light,
                    fontWeight: 600,
                  })),
              ]}
            >
              {stopLoss}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'tags',
        size: 200,
        header: 'Tags',
        cell: ({ row }) => {
          const value = row.original.tags;
          if (!Array.isArray(value) || value.length === 0) {
            return <NotFoundValue />;
          }
          return <TradeTagsCell tags={value} />;
        },
      },
      {
        accessorKey: 'openDate',
        header: 'Open',
        cell: ({ row }) => {
          const value = row.original.openDate;
          if (!value) return <NotFoundValue />;
          return (
            <ClampedTextContainer variant="body2">{format(new Date(value), 'dd/MM/yy HH:mm')}</ClampedTextContainer>
          );
        },
      },
      {
        accessorKey: 'closeDate',
        header: 'Close',
        cell: ({ row }) => {
          const value = row.original.closeDate;
          if (!value) return <NotFoundValue />;
          return (
            <ClampedTextContainer variant="body2">{format(new Date(value), 'dd/MM/yy HH:mm')}</ClampedTextContainer>
          );
        },
      },
      {
        accessorKey: 'comment',
        header: 'Comment',
        cell: ({ row }) => {
          const value = row.original.comment;
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
