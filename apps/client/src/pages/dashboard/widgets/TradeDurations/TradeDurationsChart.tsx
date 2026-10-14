import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '../../../../enums';
import { getTradeDurations } from '../../../../lib/db/api/stats/duration';
import type { ProfitabilityAnalysis } from '../../../../lib/db/api/stats/types';

type BucketData = {
  period: string;
  winCount: number;
  lossCount: number;
};

const transformData = (analysis: ProfitabilityAnalysis): BucketData[] => {
  const winBuckets = analysis.winBuckets;
  const lossBuckets = analysis.lossBuckets;

  // 1. Get all unique period labels from both win and loss buckets
  const allPeriods = Array.from(new Set([...Object.keys(winBuckets), ...Object.keys(lossBuckets)]));

  // 2. Sort the periods so the graph goes 0-15m, 15-30m, etc.
  // Since labels are "0-15m", we sort by the starting number
  allPeriods.sort((a, b) => {
    const startA = parseInt(a.split('-')[0]);
    const startB = parseInt(b.split('-')[0]);
    return startA - startB;
  });

  // 3. Map to the final array format
  return allPeriods.map((period) => ({
    period: period,
    winCount: winBuckets[period] || 0,
    lossCount: lossBuckets[period] || 0,
  }));
};

const TradeDurationsChart = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.STATS, QueryKey.STATS_DURATION],
    queryFn: () => getTradeDurations(),
  });

  const chartProps = useMemo(() => {
    if (!data) return null;
    const chartData = transformData(data);

    return {
      dataset: chartData,
      xAxis: [
        {
          data: chartData.map((el) => el.period),
          label: 'Period',
          categoryGapRatio: 0.06,
          barGapRatio: 0.06,
          tickPlacement: 'extremities',
        },
      ],
      yAxis: [{ label: 'Trades count' }],
      series: [
        { dataKey: 'winCount', label: 'Won trades' },
        { dataKey: 'lossCount', label: 'Lossed trades' },
      ],
    } as BarChartProps;
  }, []);

  if (!chartProps) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} {...chartProps} />
    </Box>
  );
};

export default TradeDurationsChart;
