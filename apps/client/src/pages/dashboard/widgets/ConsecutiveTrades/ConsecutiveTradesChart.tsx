import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '../../../../enums';
import type { StreakResult } from '../../../../lib/db/api/stats/types';
import { getConsecutiveTrades } from '../../../../lib/db/api/stats/consecutive';
import { DEFAULT_BAR_CHART_PROPS } from '../../consts';

const transformData = (data: StreakResult) => {
  const flatList = [];
  const allKeys = [...Object.keys(data.win), ...Object.keys(data.loss)].map(Number);
  const maxStreak = allKeys.length > 0 ? Math.max(...allKeys) : 0;

  for (let i = 1; i <= maxStreak; i++) {
    const key = i.toString();

    if (data.win[key] || data.loss[key] || data.be[key]) {
      flatList.push({
        win: data.win[key] || 0,
        loss: data.loss[key] || 0,
        count: i,
      });
    }
  }

  return flatList;
};

type ConsecutiveTradesChartProps = {};

const ConsecutiveTradesChart = ({}: ConsecutiveTradesChartProps) => {
  const { data } = useQuery({
    queryKey: [QueryKey.STATS, QueryKey.STATS_CONSECUTIVE],
    queryFn: () => getConsecutiveTrades(),
  });

  const chartProps = useMemo(() => {
    if (!data) return null;

    const chartData = transformData(data);

    return {
      dataset: chartData,
      xAxis: [
        {
          data: chartData.map((el) => el.count),
          label: 'Consecutive trades count',
          ...DEFAULT_BAR_CHART_PROPS.xAxis,
          tickLabelPlacement: 'middle',
        },
      ],
      yAxis: [{ label: 'Trades count', width: 48 }],
      margin: { left: 0, right: 0 },
      series: [
        { dataKey: 'win', label: 'Won trades', ...DEFAULT_BAR_CHART_PROPS.series },
        { dataKey: 'loss', label: 'Lost trades', ...DEFAULT_BAR_CHART_PROPS.series },
      ],
    } as BarChartProps;
  }, [data]);

  if (!chartProps) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} {...chartProps} />
    </Box>
  );
};

export default ConsecutiveTradesChart;
