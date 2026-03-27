import { useMutation, useQueryClient } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

import useModal from '../../../../../hooks/useModal';
import useSnackbar from '../../../../../hooks/useSnackbar';
import { deleteTradingSession } from '../../../../../api/tradingSessions';
import { QueryKey } from '../../../../../enums';
import { TradesPageModal } from '../../../enums';
import type { TradingSession } from '../../../../../types/tradingSessions';

type DeleteTradingSessionProps = {
  session: TradingSession;
};

const DeleteTradingSession = ({ session }: DeleteTradingSessionProps) => {
  const queryClient = useQueryClient();

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: deleteTradingSession,
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] })]);
      openSnackbar({ severity: 'success', message: 'Your trading session have been deleted.' });
      closeModal(TradesPageModal.DELETE_TRADING_SESSION);
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (session?.id) {
      mutation.mutate(session.id);
    } else {
      console.warn('Trading session ID not found');
    }
  };

  return (
    <Stack mt={-2} gap={2}>
      <Typography>
        This action cannot be undone. This will permanently delete trading session and trades that are added to that
        trading session.
      </Typography>
      <Stack direction="row" alignItems="center" gap={2} justifyContent="flex-end">
        <Button
          disabled={mutation.isPending}
          color="inherit"
          startIcon={<ClearIcon />}
          size="small"
          variant="outlined"
          onClick={() => closeModal(TradesPageModal.DELETE_TRADING_SESSION)}
        >
          Cancel
        </Button>
        <Button
          loading={mutation.isPending}
          startIcon={<DeleteIcon />}
          size="small"
          variant="contained"
          color="error"
          onClick={handleClick}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteTradingSession;
