import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import type { AxisValueFormatterContext } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import { secondsToMinutes } from 'date-fns';

import { QueryKey } from '../../../../enums';
import { getTradeDurations } from '../../../../lib/db/api/stats/duration';
import type { ProfitabilityAnalysis } from '../../../../lib/db/api/stats/types';

const formatMinutes = (value: number): string => {
  if (!value) return value.toString();

  let days = Math.floor(value / (60 * 24));
  let hours = Math.floor(value / 60);

  if (!hours) return `${value}m`;

  if (days) return `${days}d${hours}h`;
  if (hours) return `${hours}h${value % 60}m`;

  return value.toString();
};

type TTransformedDataItem = {
  interval: {
    start: string;
    startSec: number;
    end: string;
    endSec: number;
  };
  winCount: number;
  lossCount: number;
};

const transformData = (analysis: ProfitabilityAnalysis) => {
  const intervals = Object.keys(analysis);
  let data, start, end, win, loss;

  return intervals.reduce((prev, curr, index) => {
    data = analysis[curr];
    win = data.trades.filter((t) => t.result === 'win');
    loss = data.trades.filter((t) => t.result === 'loss');
    start = formatMinutes(secondsToMinutes(+(intervals[index - 1] ?? 0)));
    end = formatMinutes(secondsToMinutes(+curr));

    return [
      ...prev,
      {
        interval: {
          start,
          startSec: +(intervals[index - 1] ?? 0),
          end,
          endSec: +curr,
        },
        winCount: win.length,
        lossCount: loss.length,
      },
    ];
  }, [] as TTransformedDataItem[]);
};

type TTradeDurationsChartProps = {
  period?: number;
};

const TradeDurationsChart = ({ period }: TTradeDurationsChartProps) => {
  const theme = useTheme();
  const { data } = useQuery({
    queryKey: [QueryKey.STATS, QueryKey.STATS_DURATION, period],
    queryFn: () => getTradeDurations({ maxIntervals: period }),
  });

  const dataset = useMemo(() => {
    return data ? transformData(data) : null;
  }, [data]);

  const chartProps = useMemo(() => {
    return {
      xAxis: [
        {
          dataKey: 'interval',
          label: 'Periods',
          categoryGapRatio: 0.08,
          barGapRatio: 0,
          tickPlacement: 'end',
          tickLabelPlacement: 'tick',
          valueFormatter: (code: TTransformedDataItem['interval'], context: AxisValueFormatterContext) => {
            if (context.location === 'tick') {
              return code.end;
            }
            return `Period: ${code.start} - ${code.end}`;
          },
        },
      ],
      yAxis: [{ label: 'Trades count', width: 48 }],
      margin: { left: 0, right: 0 },
      series: [
        {
          dataKey: 'winCount',
          label: 'Won trades',
          color: theme.palette.success.light,
          highlightScope: { highlight: 'series', fade: 'global' },
        },
        {
          dataKey: 'lossCount',
          label: 'Lost trades',
          color: theme.palette.error.light,
          highlightScope: { highlight: 'series', fade: 'global' },
        },
      ],
    } as BarChartProps;
  }, [theme.palette]);

  if (!dataset) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} dataset={dataset} {...chartProps} />
    </Box>
  );
};

export default TradeDurationsChart;
