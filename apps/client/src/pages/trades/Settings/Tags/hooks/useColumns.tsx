import type { ColumnDef } from '@tanstack/react-table';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { useMemo } from 'react';

import type { Tag } from '../../../../../types/tag';

import ClampedTextContainer from '../../../../../components/ClampedTextContainer';
import MenuActions from '../../../../../components/MenuActions';
import { tableMainFeatures } from '../../../../../components/table/consts';
import useModal from '../../../../../hooks/useModal';
import checkBrightness from '../../../../../lib/checkBrighness';
import { TradesPageModal } from '../../../enums';

const TagActions = ({ tag }: { tag: Tag }) => {
  const { openModal } = useModal();

  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <MenuActions>
        <MenuActions.Item
          label="Edit tag"
          icon={<EditIcon fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.EDIT_TAG, tag);
            handleClose();
          }}
        />
        <MenuActions.Item
          label="Delete tag"
          icon={<DeleteIcon color="error" fontSize="small" />}
          onClick={(_, handleClose) => {
            openModal(TradesPageModal.DELETE_TAG, tag);
            handleClose();
          }}
        />
      </MenuActions>
    </Stack>
  );
};

const useColumns = () => {
  return useMemo<ColumnDef<typeof tableMainFeatures, Tag>[]>(() => {
    return [
      {
        accessorKey: 'title',
        enableSorting: false,
        header: 'Title',
        cell: ({ row }) => {
          const value = row.original.title;
          return <ClampedTextContainer>{value}</ClampedTextContainer>;
        },
      },
      {
        accessorKey: 'createdAt',
        enableSorting: false,
        header: 'Created',
        size: 80,
        cell: ({ row }) => <Typography>{format(row.original.createdAt, 'dd/MM/yyyy')}</Typography>,
      },
      {
        accessorKey: 'color',
        enableSorting: false,
        header: 'Color',
        cell: ({ row }) => {
          const value = row.original.color;
          return (
            <Chip
              label={value}
              size="small"
              sx={(theme) => ({
                minWidth: '10rem',
                textAlign: 'center',
                backgroundColor: value,
                color: checkBrightness(value) ? theme.palette.common.white : theme.palette.common.black,
                paddingInline: theme.spacing(1),
              })}
            />
          );
        },
      },
      {
        accessorKey: 'actions',
        enableSorting: false,
        header: '',
        size: 80,
        cell: ({ row }) => <TagActions tag={row.original} />,
      },
    ];
  }, []);
};

export default useColumns;
