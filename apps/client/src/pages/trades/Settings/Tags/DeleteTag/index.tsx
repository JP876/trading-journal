import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTag } from '../../../../../api/tags';
import { QueryKey } from '../../../../../enums';
import useSnackbar from '../../../../../hooks/useSnackbar';
import useModal from '../../../../../hooks/useModal';
import { TradesPageModal } from '../../../enums';
import type { Tag } from '../../../../../types/tag';

type DeleteTagProps = {
  tag: Tag;
};

const DeleteTag = ({ tag }: DeleteTagProps) => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModal();

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
    <Stack mt={-2} gap={2}>
      <Typography>This action cannot be undone. This will permanently delete tag.</Typography>
      <Stack direction="row" alignItems="center" gap={2} justifyContent="flex-end">
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
