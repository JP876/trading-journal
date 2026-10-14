import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';

import { findConsecutiveTrades, type StreakResult } from '../../lib/db/api/stats';
import { QueryKey } from '../../enums';

const transformData = (data: StreakResult) => {
  const flatList = [];
  const allKeys = [...Object.keys(data.win), ...Object.keys(data.loss), ...Object.keys(data.be)].map(Number);
  const maxStreak = allKeys.length > 0 ? Math.max(...allKeys) : 0;

  for (let i = 1; i <= maxStreak; i++) {
    const key = i.toString();

    if (data.win[key] || data.loss[key] || data.be[key]) {
      flatList.push({
        win: data.win[key] || 0,
        loss: data.loss[key] || 0,
        be: data.be[key] || 0,
        count: i,
      });
    }
  }

  return flatList;
};

const ConsecutiveTrades = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.STATS],
    queryFn: () => findConsecutiveTrades(),
    staleTime: Infinity,
  });

  const chartProps: BarChartProps | null = useMemo(() => {
    if (!data) return null;
    const formatted = transformData(data);

    return {
      dataset: formatted,
      xAxis: [
        {
          data: formatted.map((el) => el.count),
          categoryGapRatio: 0.4,
          barGapRatio: 0.2,
          tickPlacement: 'extremities',
        },
      ],
      series: [
        { dataKey: 'win', label: 'Won trades' },
        { dataKey: 'loss', label: 'Lossed trades' },
        { dataKey: 'be', label: 'BE trades' },
      ],
    } as BarChartProps;
  }, [data]);

  if (!chartProps) return null;

  return (
    <Box width={600}>
      <BarChart height={300} borderRadius={4} {...chartProps} />
    </Box>
  );
};

export default ConsecutiveTrades;
