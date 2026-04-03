import { memo, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NumbersIcon from '@mui/icons-material/Numbers';
import type { ColumnDef } from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TradingSession } from '../../../../../types/tradingSessions';
import MenuActions from '../../../../../components/MenuActions';
import useModal from '../../../../../hooks/useModal';
import { TradesPageModal } from '../../../enums';
import NotFoundValue from '../../../../../components/NotFoundValue';
import { editTradingSession } from '../../../../../api/tradingSessions';
import useSnackbar from '../../../../../hooks/useSnackbar';
import { QueryKey } from '../../../../../enums';
import ClampedTextContainer from '../../../../../components/ClampedTextContainer';
import { format } from 'date-fns';

const TradingSessionActions = ({ session }: { session: TradingSession }) => {
  const { openModal } = useModal();

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <MenuActions>
        <MenuActions.Item
          label="Edit session"
          icon={<EditIcon fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.EDIT_TRADING_SESSION, session);
            handleClose();
          }}
        />
        <MenuActions.Item
          label="Delete session"
          icon={<DeleteIcon color="error" fontSize="small" />}
          menuItemProps={{ disabled: !!session.isMain }}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.DELETE_TRADING_SESSION, session);
            handleClose();
          }}
        />
      </MenuActions>
    </Stack>
  );
};

const TradingSessionMainSwitch = memo(({ id, isMain }: { id: number; isMain: boolean }) => {
  const { openSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => editTradingSession(id, { isMain: true }),
    onSettled: async () => {
      openSnackbar({ severity: 'success', message: 'The trading session was processed successfully.' });
      return await Promise.all([
        queryClient.refetchQueries({ queryKey: [QueryKey.TRADING_SESSIONS] }),
        queryClient.refetchQueries({ queryKey: [QueryKey.TRADES] }),
      ]);
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your session.' });
    },
  });

  return (
    <Switch
      size="small"
      checked={!!isMain}
      onChange={() => mutation.mutate()}
      disabled={!!isMain}
      sx={{ opacity: mutation.isPending ? 0.4 : 1 }}
    />
  );
});

const useColumns = () => {
  return useMemo<ColumnDef<TradingSession>[]>(() => {
    return [
      {
        accessorKey: 'title',
        header: 'Title',
        size: 140,
        cell: ({ row }) => {
          const value = row.original.title;
          return value ? <ClampedTextContainer maxRows={1}>{value}</ClampedTextContainer> : <NotFoundValue />;
        },
      },
      {
        accessorKey: 'tradesCount',
        header: () => (
          <Stack direction="row" alignItems="center">
            <NumbersIcon fontSize="small" />
            Trades
          </Stack>
        ),
        size: 60,
        cell: ({ row }) => {
          return <Typography>{row.original.tradesCount}</Typography>;
        },
      },
      {
        accessorKey: 'isMain',
        header: 'Main',
        size: 80,
        cell: ({ row }) => <TradingSessionMainSwitch id={row.original.id} isMain={!!row.original.isMain} />,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        minSize: 300,
        cell: ({ row }) => {
          const value = row.original.description;
          return value ? <ClampedTextContainer maxRows={1}>{value}</ClampedTextContainer> : <NotFoundValue />;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        size: 60,
        cell: ({ row }) => {
          const value = row.original.createdAt;
          if (!value) return <NotFoundValue />;
          return <Typography>{format(row.original?.createdAt, 'dd/MM/yyyy')}</Typography>;
        },
      },
      {
        accessorKey: 'actions',
        header: '',
        size: 80,
        cell: ({ row }) => <TradingSessionActions session={row.original} />,
      },
    ];
  }, []);
};

export default useColumns;
