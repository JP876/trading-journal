import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ColumnDef } from '@tanstack/react-table';

import type { Tag } from '../../../../../types/tag';
import ClampedTextContainer from '../../../../../components/ClampedTextContainer';
import useModal from '../../../../../hooks/useModal';
import MenuActions from '../../../../../components/MenuActions';
import { TradesPageModal } from '../../../enums';
import checkBrightness from '../../../../../lib/checkBrighness';

const TagActions = ({ tag }: { tag: Tag }) => {
  const { openModal } = useModal();

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
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
  return useMemo<ColumnDef<Tag>[]>(() => {
    return [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
          const value = row.original.title;
          return <ClampedTextContainer>{value}</ClampedTextContainer>;
        },
      },
      {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => {
          const value = row.original.color;
          return (
            <Chip
              label={value}
              size="small"
              sx={(theme) => ({
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
        header: '',
        size: 80,
        cell: ({ row }) => <TagActions tag={row.original} />,
      },
    ];
  }, []);
};

export default useColumns;
