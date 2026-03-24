import { useId } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { editTradingSession, getTradingSessions } from '../../../../api/tradingSessions';
import withCatch from '../../../../lib/withCatch';
import useSnackbar from '../../../../hooks/useSnackbar';

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
    mutationFn: async (id: number) => {
      const [error] = await withCatch(editTradingSession(id, { isMain: 1 }));

      if (error) {
        openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your session.' });
        return;
      }

      openSnackbar({ severity: 'success', message: 'The trading session was processed successfully.' });
      await queryClient.invalidateQueries({ queryKey: ['trading-sessions'] });
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
