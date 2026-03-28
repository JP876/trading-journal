import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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

  const [title, setTitle] = useState('');

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const mutation = useMutation({
    mutationFn: deleteTradingSession,
    onSuccess: async () => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: [QueryKey.TRADING_SESSIONS] })]);
      openSnackbar({ severity: 'success', message: 'Your trading session have been deleted.' });
      closeModal(TradesPageModal.DELETE_TRADING_SESSION);
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your session.' });
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
        This action{' '}
        <Box component="span" sx={(theme) => ({ color: theme.palette.error.main, textTransform: 'uppercase' })}>
          cannot
        </Box>{' '}
        be undone. This will permanently delete{' '}
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {session?.title || ''}
        </Box>{' '}
        trading session{session?.tradesCount ? ' and trades that are added to that trading session.' : '.'}
      </Typography>

      <Box>
        <Typography mb={1}>Please type in the title of the trading session to confirm.</Typography>
        <TextField
          fullWidth
          label="Trading session title"
          size="small"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Box>

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
          disabled={title !== session?.title}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};

export default DeleteTradingSession;
