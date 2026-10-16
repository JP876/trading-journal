import { memo, useId, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

import TradeDurationsChart from './TradeDurationsChart';
import { increasingRange } from '../../../../lib/utils';

const options = increasingRange(10, 20, 2);

const TradeDurations = () => {
  const labelId = useId();
  const [period, setPeriod] = useState('10');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const nextValue = event.target.value as string;
    setPeriod(nextValue);
  };

  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
        <Stack>
          <Typography variant="h5">Trade durations</Typography>
          <Typography variant="caption" sx={() => ({ textWrap: 'pretty' })}>
            Your quickest profit. This is the ideal duration for your winning strategy.
          </Typography>
        </Stack>

        <FormControl sx={{ width: '6.4rem' }} size="small">
          <InputLabel id={labelId}>Period count</InputLabel>
          <Select labelId={labelId} value={period} label="Period count" onChange={handleChange}>
            {options.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TradeDurationsChart period={+period} />
    </Paper>
  );
};

export default memo(TradeDurations);
