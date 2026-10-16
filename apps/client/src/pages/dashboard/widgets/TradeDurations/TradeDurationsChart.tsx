import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import { useQuery } from '@tanstack/react-query';
import { secondsToMinutes } from 'date-fns';
import { useMemo } from 'react';

import { QueryKey } from '../../../../enums';
import { getTradeDurations } from '../../../../lib/db/api/stats/duration';
import type { TDurationAnalysis } from '../../../../lib/db/api/stats/types';
import { DEFAULT_BAR_CHART_PROPS } from '../../consts';
import type { TTradeDurationsChartProps, TTradeDurationsTooltipProps, TTransformedDataItem } from './types';

declare module '@mui/x-charts' {
  interface TooltipPropsOverrides extends TTradeDurationsTooltipProps {}
}

const formatMinutes = (value: number): string => {
  if (!value) return value.toString();

  let days = Math.floor(value / (60 * 24));
  let hours = Math.floor(value / 60);

  if (!hours) return `${value}m`;

  if (days) return `${days}d${hours}h`;
  if (hours) return `${hours}h${value % 60}m`;

  return value.toString();
};

const transformData = (analysis: TDurationAnalysis) => {
  const intervals = Object.keys(analysis);
  let data, start, end;

  return intervals.reduce((prev, curr, index) => {
    data = analysis[curr];
    start = formatMinutes(secondsToMinutes(+(intervals[index - 1] ?? 0)));
    end = formatMinutes(secondsToMinutes(+curr));

    return [
      ...prev,
      {
        interval: { start, startSec: +(intervals[index - 1] ?? 0), end, endSec: +curr },
        win: data.trades.filter((t) => t.result === 'win'),
        loss: data.trades.filter((t) => t.result === 'loss'),
      },
    ];
  }, [] as TTransformedDataItem[]);
};

const TradeDurationsChart = ({ period }: TTradeDurationsChartProps) => {
  const theme = useTheme();
  const { data } = useQuery({
    queryKey: [QueryKey.STATS, QueryKey.STATS_DURATION, period],
    queryFn: () => getTradeDurations({ maxIntervals: period }),
  });

  const chartProps = useMemo(() => {
    if (!data) return null;
    const chartData = transformData(data);

    return {
      dataset: chartData,
      xAxis: [
        {
          ...DEFAULT_BAR_CHART_PROPS.xAxis,
          data: chartData.map((d) => `Period: ${d.interval.start} - ${d.interval.end}`),
          label: 'Periods',
        },
      ],
      yAxis: [{ label: 'Trades count', width: 48 }],
      margin: { left: 0, right: 0 },
      series: [
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          id: 'WON_TRADES',
          data: chartData.map((d) => d.win.length),
          label: 'Won trades',
          color: theme.palette.success.light,
        },
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          id: 'LOST_TRADES',
          data: chartData.map((d) => d.loss.length),
          label: 'Lost trades',
          color: theme.palette.error.light,
        },
      ],
      // slots: { tooltip: TradeDurationsTooltip },
      // slotProps: { tooltip: { chartData } },
    } as BarChartProps;
  }, [theme.palette, data]);

  if (!chartProps) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} {...chartProps} />
    </Box>
  );
};

export default TradeDurationsChart;
