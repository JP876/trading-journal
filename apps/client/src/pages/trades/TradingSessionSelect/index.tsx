import { useId } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useSnackbar from '../../../hooks/useSnackbar';
import { editTradingSession, getTradingSessions } from '../../../api/tradingSessions';

const TradingSessionSelect = () => {
  const labelId = useId();
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();

  const { data } = useQuery({
    queryKey: ['trading-sessions'],
    queryFn: getTradingSessions,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: (id: number) => editTradingSession(id, { isMain: 1 }),
    onSuccess: async () => {
      openSnackbar({ severity: 'success', message: 'The trading session was processed successfully.' });
      await queryClient.refetchQueries({ queryKey: ['trading-sessions'] });
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
        <InputLabel id={labelId}>Main trading session</InputLabel>
        <Select
          labelId={labelId}
          id="trading-session-simple-select"
          value={(data || []).find((el) => el?.isMain)?.id.toString() || ''}
          label="Main trading session"
          onChange={handleChange}
          disabled={!Array.isArray(data) || data?.length === 0}
        >
          {(data || []).map((el) => (
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
