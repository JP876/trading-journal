import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Tag } from '../../../../../types/tag';

import { deleteTag } from '../../../../../api/tags';
import { QueryKey } from '../../../../../enums';
import useModal from '../../../../../hooks/useModal';
import useModalData from '../../../../../hooks/useModalData';
import useSnackbar from '../../../../../hooks/useSnackbar';
import { TradesPageModal } from '../../../enums';

const DeleteTag = () => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const tag = useModalData<Tag>(TradesPageModal.DELETE_TAG);

  const mutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TAGS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
      ]);
      closeModal(TradesPageModal.DELETE_TAG);
      openSnackbar({ severity: 'success', message: 'Your tag details have been deleted.' });
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your tag.' });
    },
  });

  const handleDeleteTrade = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (tag?.id) {
      mutation.mutate(tag.id);
    } else {
      console.warn('Tag ID not found');
    }
  };

  return (
    <Stack sx={{ mt: -1, gap: 2 }}>
      <Typography>This action cannot be undone. This will permanently delete tag.</Typography>
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          disabled={mutation.isPending}
          color="inherit"
          startIcon={<ClearIcon />}
          size="small"
          variant="outlined"
          onClick={() => closeModal(TradesPageModal.DELETE_TAG)}
        >
          Cancel
        </Button>
        <Button
          loading={mutation.isPending}
          startIcon={<DeleteIcon />}
          size="small"
          variant="contained"
          color="error"
          onClick={handleDeleteTrade}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteTag;
