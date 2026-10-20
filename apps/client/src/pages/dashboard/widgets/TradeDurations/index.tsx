import HistoryIcon from '@mui/icons-material/History';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Provider, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useEffect, useId } from 'react';

import ClampedTextContainer from '../../../../components/ClampedTextContainer';
import { increasingRange } from '../../../../lib/utils';
import {
  handlePreviousPeriodAtom,
  periodsAtom,
  periodsCountAtom,
  resetStoreAtom,
  tradeDurationsChartStore,
} from './atoms';
import TradeDurationsChart from './TradeDurationsChart';

const options = increasingRange(10, 20, 2);

const ResetButtonMain = memo(({ disabled }: { disabled: boolean }) => {
  const handlePreviousPeriod = useSetAtom(handlePreviousPeriodAtom, { store: tradeDurationsChartStore });

  return (
    <Tooltip arrow title="Back" disableInteractive>
      <span>
        <IconButton size="small" disabled={disabled} onClick={handlePreviousPeriod}>
          <HistoryIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
});

const ResetButton = () => {
  const period = useAtomValue(periodsAtom, { store: tradeDurationsChartStore });
  return <ResetButtonMain disabled={!period} />;
};

const PeriodSelect = () => {
  const labelId = useId();

  const [periodCount, setPeriodCount] = useAtom(periodsCountAtom, {
    store: tradeDurationsChartStore,
  });

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const nextValue = event.target.value as string;
    setPeriodCount(nextValue);
  };

  return (
    <FormControl sx={{ width: '6rem' }} size="small">
      <InputLabel id={labelId}>Period count</InputLabel>
      <Select labelId={labelId} value={periodCount} label="Period count" onChange={handleChange}>
        {options.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const TradeDurationsMain = () => {
  return (
    <Paper sx={(theme) => ({ padding: theme.spacing(2), display: 'flex', flexDirection: 'column' })}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
        <Stack>
          <Typography variant="h5">Trade durations</Typography>
          <ClampedTextContainer variant="caption">
            Your quickest profit. This is the ideal duration for your winning strategy.
          </ClampedTextContainer>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <ResetButton />
          <PeriodSelect />
        </Stack>
      </Stack>

      <TradeDurationsChart />
    </Paper>
  );
};

const TradeDurations = () => {
  const resetTradeDurations = useSetAtom(resetStoreAtom, { store: tradeDurationsChartStore });

  useEffect(() => {
    resetTradeDurations();
  }, []);

  return (
    <Provider store={tradeDurationsChartStore}>
      <TradeDurationsMain />
    </Provider>
  );
};

export default memo(TradeDurations);
