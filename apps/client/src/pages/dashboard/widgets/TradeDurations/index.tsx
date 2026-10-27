import HistoryIcon from '@mui/icons-material/History';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Provider, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useEffect, useId } from 'react';

import { increasingRange } from '../../../../lib/utils';
import WidgetContainer, { type TWidgetContainerProps } from '../WidgetContainer';
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

type TTradeDurationsProps = {
  paperProps?: TWidgetContainerProps['paperProps'];
};

const TradeDurations = ({ paperProps }: TTradeDurationsProps) => {
  const resetStore = useSetAtom(resetStoreAtom, { store: tradeDurationsChartStore });

  useEffect(() => {
    resetStore();
  }, []);

  return (
    <Provider store={tradeDurationsChartStore}>
      <WidgetContainer
        title="Trade durations"
        description="Your quickest profit. This is the ideal duration for your winning strategy."
        paperProps={paperProps}
        renderActions={() => (
          <Stack direction="row" alignItems="center" gap={1}>
            <ResetButton />
            <PeriodSelect />
          </Stack>
        )}
      >
        <TradeDurationsChart />
      </WidgetContainer>
    </Provider>
  );
};

export default TradeDurations;
