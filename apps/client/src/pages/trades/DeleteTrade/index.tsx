import { useMutation, useQueryClient } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import type { Trade } from '../../../types/trade';
import useModal from '../../../hooks/useModal';
import useSnackbar from '../../../hooks/useSnackbar';
import { deleteTrade } from '../../../api/trades';
import DialogMain from '../../../components/DialogMain';
import { TradesPageModal } from '../enums';

type DeleteTradeDialogProps = {
  trade: Trade;
};

const DeleteTradeDialog = ({ trade }: DeleteTradeDialogProps) => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: deleteTrade,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['trades'] }),
        queryClient.invalidateQueries({ queryKey: ['stats'] }),
      ]);
      openSnackbar({ severity: 'success', message: 'Your trade have been deleted.' });
      closeModal(TradesPageModal.deleteTrade);
    },
  });

  const handleDeleteTrade = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (trade?.id) {
      mutation.mutate(trade.id);
    } else {
      console.warn('Trade ID not found');
    }
  };

  return (
    <DialogMain
      id={TradesPageModal.deleteTrade}
      title="Are you absolutely sure?"
      hideCloseBtn
      dialogContentProps={{ dividers: false }}
    >
      <Stack mt={-2} gap={2}>
        <Typography>This action cannot be undone. This will permanently delete trade.</Typography>
        <Stack direction="row" alignItems="center" gap={2} justifyContent="flex-end">
          <Button
            disabled={mutation.isPending}
            color="inherit"
            startIcon={<ClearIcon />}
            size="small"
            variant="outlined"
            onClick={() => closeModal(TradesPageModal.deleteTrade)}
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
