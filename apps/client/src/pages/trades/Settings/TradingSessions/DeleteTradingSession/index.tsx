import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { TradingSession } from '../../../../../types/tradingSessions';

import { deleteTradingSession } from '../../../../../api/tradingSessions';
import { QueryKey } from '../../../../../enums';
import useModal from '../../../../../hooks/useModal';
import useModalData from '../../../../../hooks/useModalData';
import useSnackbar from '../../../../../hooks/useSnackbar';
import { TradesPageModal } from '../../../enums';
import { getTradesPerTradingSessionQuery } from '../../../queryOptions';

const DeleteTradingSession = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const session = useModalData<TradingSession>(TradesPageModal.DELETE_TRADING_SESSION);

  const { closeModal } = useModal();
  const { openSnackbar } = useSnackbar();

  const { data } = useQuery(getTradesPerTradingSessionQuery());
  const count = (data || []).find((el) => el.tradingSession === session?.id)?.count || 0;

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
    <Stack sx={{ mt: -2, gap: 2 }}>
      <Typography>
        This action{' '}
        <Box component="span" sx={(theme) => ({ color: theme.palette.error.main, textTransform: 'uppercase' })}>
          cannot
        </Box>{' '}
        be undone. This will permanently delete{' '}
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {session?.title || ''}
        </Box>{' '}
        trading session{count ? ` and trades(${count}) that are added to that trading session.` : '.'}
      </Typography>

      <Box>
        <Typography sx={{ mb: 1 }}>Please type in the title of the trading session to confirm.</Typography>
        <TextField
          fullWidth
          label="Trading session title"
          size="small"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Box>

      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
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
