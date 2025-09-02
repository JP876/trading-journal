import { MouseEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import { deleteTrade } from '@/api/trades';
import DialogMain from '@/components/DialogMain';
import { TradeType } from '@/types/trades';
import useAppStore from '@/store';

const DeleteTradeDialog = ({ trade, closeModal }: { trade: TradeType; closeModal: () => void }) => {
  const queryClient = useQueryClient();
  const openToast = useAppStore((state) => state.openToast);

  const mutation = useMutation({
    mutationFn: deleteTrade,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['trades'] }),
        queryClient.invalidateQueries({ queryKey: ['stats'] }),
      ]);
      openToast({ severity: 'success', message: 'Your trade have been deleted.' });
      closeModal();
    },
  });

  const handleDeleteTrade = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (trade?._id) {
      mutation.mutate(trade?._id);
    } else {
      console.warn('Trade ID not found');
    }
  };

  return (
    <DialogMain id="deleteTrade" title="Are you absolutely sure?" hideCloseBtn dialogContentProps={{ dividers: false }}>
      <Stack mt={-2} gap={2}>
        <Typography>This action cannot be undone. This will permanently delete trade.</Typography>
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

export default DeleteTradeDialog;
