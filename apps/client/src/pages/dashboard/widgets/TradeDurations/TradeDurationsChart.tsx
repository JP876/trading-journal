import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import type { AxisValueFormatterContext } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import { secondsToMinutes } from 'date-fns';

import { QueryKey } from '../../../../enums';
import { getTradeDurationAnalysis, getTradeDurationInfo } from '../../utils/duration';
import type { TDurationAnalysis } from '../../utils/types';
import { DEFAULT_BAR_CHART_PROPS } from '../../consts';
import type { TTradeDurationsChartProps, TTradeDurationsTooltipProps, TTransformedDataItem } from './types';
import { getTrades } from '../../../../api/trades';

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

const transformData = (analysis: TDurationAnalysis, shortest: number = 0) => {
  const intervals = Object.keys(analysis);
  let data, start, end;

  return intervals.reduce((prev, curr, index) => {
    data = analysis[curr];
    start = formatMinutes(secondsToMinutes(+(intervals[index - 1] ?? shortest)));
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

  const trades = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  const chartData = (() => {
    if (!trades.data?.results) return null;

    const { shortest, longest } = getTradeDurationInfo(trades.data.results);
    const analysis = getTradeDurationAnalysis(trades.data?.results || [], {
      maxIntervals: period,
      shortestDuration: shortest.duration,
      longestDuration: longest.duration,
    });

    return transformData(analysis, shortest.duration);
  })();

  const chartProps = (() => {
    if (!chartData) return null;

    return {
      dataset: chartData,
      xAxis: [
        {
          ...DEFAULT_BAR_CHART_PROPS.xAxis,
          data: chartData.map((d) => d.interval),
          label: 'Periods',
          valueFormatter: (value: TTransformedDataItem['interval'], context: AxisValueFormatterContext) => {
            if (context.location === 'tooltip') {
              return `Period: ${value.start} - ${value.end}`;
            }
            return value.end;
          },
        },
      ],
      yAxis: [{ label: 'Trades count', width: 42 }],
      margin: 0,
      series: [
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          id: 'WON_TRADES',
          data: chartData.map((d) => d.win.length),
          label: 'Won trades',
          color: theme.palette.success.main,
        },
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          id: 'LOST_TRADES',
          data: chartData.map((d) => d.loss.length),
          label: 'Lost trades',
          color: theme.palette.error.main,
        },
      ],
      // slots: { tooltip: TradeDurationsTooltip },
      // slotProps: { tooltip: { chartData } },
    } as BarChartProps;
  })();

  if (!chartProps) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} {...chartProps} />
    </Box>
  );
};

export default TradeDurationsChart;
