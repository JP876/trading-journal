import { useCallback, useMemo } from 'react';
import { isSameDay } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Badge, Box, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { DateCalendar, DayCalendarSkeleton, PickersDay, PickersDayProps } from '@mui/x-date-pickers';

import { getNumOfTradesPerDay } from '@/api/trades';
import { NumOfTradesPerDate, TradeResult } from '@/types/trades';
import StatsContainer from './StatsContainer';
import useMainAccount from '../hooks/useMainAccount';

const TradesDetailsTooltip = ({
  dayData,
  children,
}: {
  dayData: NumOfTradesPerDate | null;
  children: React.ReactElement<unknown, any>;
}) => {
  const renderDetails = useCallback((dayData: NumOfTradesPerDate | null) => {
    if (!dayData?._id) return '';
    return (
      <Stack p={0.5} gap={0.5}>
        {dayData.list.map((trade) => (
          <Box
            key={trade.id}
            sx={{ display: 'grid', gridTemplateColumns: '1fr 4rem 1rem', alignItems: 'center', gap: 1.5 }}
          >
            <Typography variant="subtitle2">{trade.pair}</Typography>
            <Chip
              label={trade.result}
              size="small"
              sx={[
                (theme) => ({
                  textTransform: 'uppercase',
                  width: '3.6rem',
                  height: '1.2rem',
                  color: theme.palette.common.white,
                }),
                trade.result === TradeResult.WIN && ((theme) => ({ backgroundColor: theme.palette.success.light })),
                trade.result === TradeResult.LOSS && ((theme) => ({ backgroundColor: theme.palette.error.main })),
              ]}
            />
            <IconButton
              size="small"
              sx={[(theme) => ({ height: '.6rem', width: '.6rem', '& svg': { color: theme.palette.common.white } })]}
            >
              <InfoOutlineIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
    );
  }, []);

  return (
    <Tooltip arrow title={renderDetails(dayData)}>
      {children}
    </Tooltip>
  );
};

const NumOfTradesPickerDay = (props: PickersDayProps & { data?: NumOfTradesPerDate[] }) => {
  const { data, day, outsideCurrentMonth, ...other } = props;

  const dayData = useMemo<NumOfTradesPerDate | null>(() => {
    if (!Array.isArray(data) || !day || outsideCurrentMonth) return null;
    return data.find((el) => isSameDay(new Date(el?._id), new Date(day))) || null;
  }, [data, day, outsideCurrentMonth]);

  return (
    <Badge key={day.toString()} badgeContent={dayData?.count} color="primary" overlap="circular">
      <TradesDetailsTooltip dayData={dayData}>
        <span>
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </span>
      </TradesDetailsTooltip>
    </Badge>
  );
};

const NumOfTradesPerDateCalendar = () => {
  const mainAccount = useMainAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'num-of-trades-per-day'],
    queryFn: () => getNumOfTradesPerDay(mainAccount?._id || ''),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!mainAccount,
  });

  const minDate = useMemo(() => {
    if (!Array.isArray(data)) return undefined;
    return data[0]._id ? new Date(data[0]._id) : undefined;
  }, [data]);

  return (
    <StatsContainer title="Daily trade volume">
      <Box sx={{ height: '20rem', '& .MuiBadge-root span': { top: '22%' } }}>
        <DateCalendar
          disableFuture
          displayWeekNumber
          minDate={minDate}
          loading={isLoading}
          value={new Date()}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{ day: NumOfTradesPickerDay }}
          slotProps={{ day: { data } as any }}
          views={['month', 'day']}
          sx={{ width: 'inherit', height: 'inherit', maxHeight: 'inherit', justifyContent: 'center' }}
        />
      </Box>
    </StatsContainer>
  );
};

export default NumOfTradesPerDateCalendar;
