import { useQuery } from '@tanstack/react-query';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { millisecondsToHours, millisecondsToMinutes } from 'date-fns';

import { getGeneralStatsInfo } from '@/api/trades';
import StatsContainer from '../StatsContainer';
import WinRateByDirectionTable from './WinRateByDirectionTable';
import useMainAccount from '../../hooks/useMainAccount';

const formatTimeDiff = (ms?: number): string => {
  if (!ms) return '-';

  let min = millisecondsToMinutes(ms);
  let hours = millisecondsToHours(ms);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d/${hours % 24}h/${min % 60}min`;
  } else if (min > 60) {
    return `${hours}h/${min % 60}min`;
  } else {
    return `${min}min`;
  }
};

type GridInfoItemProps = {
  title: string;
  value?: string | number;
  children?: React.ReactNode;
};

const GridInfoItem = ({ title, value, children }: GridInfoItemProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr .6fr' }}>
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
  const mainAccount = useMainAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'general-stats-info'],
    queryFn: () => getGeneralStatsInfo(mainAccount?._id || ''),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!mainAccount,
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
        <GridInfoItem title="Average trades per week" value={Math.round(data?.avgTradesPerWeek || 0)} />
        <Divider />
        <WinRateByDirectionTable data={data?.winRateByDirection || []} />
      </Stack>
    </StatsContainer>
  );
};

export default GeneralInfo;
