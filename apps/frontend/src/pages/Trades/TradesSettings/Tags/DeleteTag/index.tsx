import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import { TagType } from '@/types/tags';
import { deleteTag } from '@/api/tags';
import DialogMain from '@/components/DialogMain';

type DeleteTagDialogProps = {
  tag: TagType;
  closeModal: () => void;
};

const DeleteTagDialog = ({ tag, closeModal }: DeleteTagDialogProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal();
    },
  });

  const handleDeleteTrade = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (tag?._id) {
      mutation.mutate(tag?._id);
    } else {
      console.warn('Tag ID not found');
    }
  };

  return (
    <DialogMain id="deleteTag" title="Are you absolutely sure?" hideCloseBtn dialogContentProps={{ dividers: false }}>
      <Stack mt={-2} gap={2}>
        <Typography>This action cannot be undone. This will permanently delete tag.</Typography>
        <Stack direction="row" alignItems="center" gap={2} justifyContent="flex-end">
          <Button
            disabled={mutation.isPending}
            color="inherit"
            startIcon={<ClearIcon />}
            size="small"
            variant="outlined"
            onClick={closeModal}
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
    </DialogMain>
  );
};

export default DeleteTagDialog;
