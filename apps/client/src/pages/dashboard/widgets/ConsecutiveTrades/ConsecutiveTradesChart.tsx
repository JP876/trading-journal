import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart';
import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '../../../../enums';
import type { TStreakResult } from '../../utils/types';
import { getConsecutiveTrades } from '../../utils/consecutive';
import { DEFAULT_BAR_CHART_PROPS } from '../../consts';
import { getTrades } from '../../../../api/trades';
import { useTheme } from '@mui/material';

const transformData = (data: TStreakResult) => {
  let flatList = [];
  let allKeys = [...Object.keys(data.win), ...Object.keys(data.loss)].map(Number);

  for (let i = 1; i <= Math.max(...allKeys); i++) {
    let key = i.toString();

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

type TConsecutiveTradesChartProps = {};

const ConsecutiveTradesChart = ({}: TConsecutiveTradesChartProps) => {
  const theme = useTheme();

  const trades = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  const chartData = (() => {
    if (!Array.isArray(trades.data?.results)) return null;
    return transformData(getConsecutiveTrades(trades.data.results));
  })();

  const chartProps = useMemo(() => {
    return {
      xAxis: [
        {
          ...DEFAULT_BAR_CHART_PROPS.xAxis,
          dataKey: 'count',
          label: 'Consecutive count',
          tickLabelPlacement: 'middle',
        },
      ],
      yAxis: [{ label: 'Count', width: 48 }],
      margin: { left: 0, right: 0 },
      series: [
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          dataKey: 'win',
          label: 'Won trades',
          color: theme.palette.success.main,
        },
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          dataKey: 'loss',
          label: 'Lost trades',
          color: theme.palette.error.main,
        },
      ],
    } as BarChartProps;
  }, [theme]);

  if (!chartData) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} dataset={chartData} {...chartProps} />
    </Box>
  );
};

export default ConsecutiveTradesChart;
