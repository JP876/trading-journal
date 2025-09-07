import { useQuery } from '@tanstack/react-query';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { millisecondsToHours, millisecondsToMinutes } from 'date-fns';

import { getGeneralStatsInfo } from '@/api/trades';
import StatsContainer from '../StatsContainer';
import WinRateByDirectionTable from './WinRateByDirectionTable';

const formatTimeDiff = (ms?: number): string => {
  if (!ms) return '-';

  let min = millisecondsToMinutes(ms);
  let hours = millisecondsToHours(ms);

  if (min === 60) {
    min = 0;
    hours = hours + 1;
  }
  if (!hours) return `${min}min`;

  return `${hours}h/${min}min`;
};

type GridInfoItemProps = {
  title: string;
  value?: string | number;
  children?: React.ReactNode;
};

const GridInfoItem = ({ title, value, children }: GridInfoItemProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr .5fr' }}>
      <Typography variant="subtitle1">{title}</Typography>
      {children ? (
        children
      ) : (
        <Typography variant="subtitle1" sx={[(theme) => ({ fontWeight: theme.typography.fontWeightMedium })]}>
          {value}
        </Typography>
      )}
    </Box>
  );
};

const GeneralInfo = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'general-stats-info'],
    queryFn: getGeneralStatsInfo,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return (
    <StatsContainer title="General Info" isLoading={isLoading}>
      <Stack p={2} gap={1}>
        <GridInfoItem title="Consecutive losses">
          <Typography
            variant="subtitle1"
            sx={[(theme) => ({ fontWeight: theme.typography.fontWeightMedium, color: theme.palette.error.main })]}
          >
            {data?.consecutiveLosses}
          </Typography>
        </GridInfoItem>
        <GridInfoItem title="Consecutive wins">
          <Typography
            variant="subtitle1"
            sx={[(theme) => ({ fontWeight: theme.typography.fontWeightMedium, color: theme.palette.success.light })]}
          >
            {data?.consecutiveWins}
          </Typography>
        </GridInfoItem>
        <Divider />
        <GridInfoItem title="Average take profit" value={`${data?.avgTakeProfit?.toFixed(1)} pips`} />
        <GridInfoItem title="Average stop loss" value={`${data?.avgStopLoss?.toFixed(1)} pips`} />
        <GridInfoItem title="Average trade duration" value={formatTimeDiff(data?.avgTradeDuration)} />
        <Divider />
        <WinRateByDirectionTable data={data?.winRateByDirection || []} />
      </Stack>
    </StatsContainer>
  );
};

export default GeneralInfo;
