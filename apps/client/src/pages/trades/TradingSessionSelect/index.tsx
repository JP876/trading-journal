import { useId } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useSnackbar from '../../../hooks/useSnackbar';
import { editTradingSession, getTradingSessions } from '../../../api/tradingSessions';
import { QueryKey } from '../../../enums';

const TradingSessionSelect = () => {
  const labelId = useId();
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();

  const { data } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS],
    queryFn: () => getTradingSessions(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: (id: number) => editTradingSession(id, { isMain: true }),
    onSuccess: async () => {
      openSnackbar({ severity: 'success', message: 'The trading session was processed successfully.' });
      await Promise.all([
        queryClient.refetchQueries({ queryKey: [QueryKey.TRADING_SESSIONS] }),
        queryClient.refetchQueries({ queryKey: [QueryKey.TRADES] }),
      ]);
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your session.' });
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    mutation.mutate(+event.target.value);
  };

  return (
    <Box sx={{ minWidth: '16rem' }}>
      <FormControl size="small" fullWidth>
        <InputLabel htmlFor="trading-session-select" id={labelId}>
          Main trading session
        </InputLabel>
        <Select
          labelId={labelId}
          slotProps={{
            input: { id: 'trading-session-select' },
          }}
          value={(data?.results || []).find((el) => el?.isMain)?.id.toString() || ''}
          label="Main trading session"
          onChange={handleChange}
          disabled={!Array.isArray(data?.results) || data?.results?.length === 0}
        >
          {(data?.results || []).map((el) => (
            <MenuItem key={el?.id} value={el.id}>
              {el?.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TradingSessionSelect;
