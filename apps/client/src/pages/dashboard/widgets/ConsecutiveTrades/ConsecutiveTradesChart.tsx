import { useMemo } from 'react';
import { Box } from '@mui/material';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '../../../../enums';
import { findConsecutiveTrades, type StreakResult } from '../../../../lib/db/api/stats';

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
    queryKey: [QueryKey.STATS],
    queryFn: () => findConsecutiveTrades(),
    staleTime: Infinity,
  });

  const chartProps = useMemo(() => {
    if (!data) return null;

    const formatted = transformData(data);

    return {
      dataset: formatted,
      xAxis: [
        {
          data: formatted.map((el) => el.count),
          label: 'Consecutive trades count',
          categoryGapRatio: 0.06,
          barGapRatio: 0.06,
          tickPlacement: 'extremities',
        },
      ],
      yAxis: [{ label: 'Trades count' }],
      series: [
        { dataKey: 'win', label: 'Won trades' },
        { dataKey: 'loss', label: 'Lossed trades' },
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
