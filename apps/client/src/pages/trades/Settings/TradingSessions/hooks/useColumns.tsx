import { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { ColumnDef } from '@tanstack/react-table';

import type { TradingSession } from '../../../../../types/tradingSessions';
import MenuActions from '../../../../../components/MenuActions';
import useModal from '../../../../../hooks/useModal';
import { TradesPageModal } from '../../../enums';
import NotFoundValue from '../../../../../components/NotFoundValue';

const TradingSessionActions = ({ session }: { session: TradingSession }) => {
  const { openModal } = useModal();

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <MenuActions>
        <MenuActions.Item
          label="Edit trading session"
          icon={<EditIcon fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.EDIT_TRADING_SESSION, session);
            handleClose();
          }}
        />
        <MenuActions.Item
          label="Delete trading session"
          icon={<DeleteIcon color="error" fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.DELETE_TRADING_SESSION, session);
            handleClose();
          }}
        />
      </MenuActions>
    </Stack>
  );
};

const useColumns = () => {
  return useMemo<ColumnDef<TradingSession>[]>(() => {
    return [
      {
        accessorKey: 'title',
        header: 'Title',
        minSize: 100,
        cell: ({ row }) => {
          return <Typography>{row.original.title}</Typography>;
        },
      },
      {
        accessorKey: 'isMain',
        header: 'Main',
        size: 80,
        cell: ({ row }) => {
          const value = row.original.isMain;
          return value ? <CheckIcon fontSize="small" color="success" /> : <CloseIcon fontSize="small" />;
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        minSize: 300,
        cell: ({ row }) => {
          const value = row.original.description;
          return value ? <Typography>{value}</Typography> : <NotFoundValue />;
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
