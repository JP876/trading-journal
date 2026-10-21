import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  type AxisValueFormatterContext,
  type BarChartProps,
  type BarItem,
  type BarLabelContext,
} from '@mui/x-charts';

import { getPairs } from '../../../../api/pairs';
import { getTrades } from '../../../../api/trades';
import { QueryKey } from '../../../../enums';
import { getPairsByProfitability } from '../../utils/profitability';
import { DEFAULT_BAR_CHART_PROPS } from '../../consts';
import type { TPairProfitability } from '../../utils/types';

const ProfitablePairsChart = () => {
  const theme = useTheme();

  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  const pairsQuery = useQuery({
    queryKey: [QueryKey.PAIRS],
    queryFn: () => getPairs(),
    staleTime: Infinity,
  });

  const chartData = (() => {
    if (!tradesQuery.data?.results || !pairsQuery?.data) return null;
    return getPairsByProfitability(tradesQuery.data.results, pairsQuery.data);
  })();

  const chartProps = (() => {
    if (!chartData) return null;

    return {
      dataset: chartData,
      xAxis: [
        {
          ...DEFAULT_BAR_CHART_PROPS.xAxis,
          data: chartData.map((d) => ({ pair: d.pair, winRate: d.winRate })),
          label: 'Pair',
          valueFormatter: (value: Pick<TPairProfitability, 'pair' | 'winRate'>, context: AxisValueFormatterContext) => {
            if (context.location === 'tooltip') {
              return `${value.pair.pair} (Win rate: ${value.winRate}%)`;
            }
            return value.pair.pair;
          },
        },
      ],
      yAxis: [{ label: 'Trades count', width: 48 }],
      margin: 0,
      series: [
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          data: chartData.map((d) => d.winCount),
          label: 'Number of won trades',
          stack: 'pair',
          color: theme.palette.success.main,
          barLabel: (item: BarItem, _: BarLabelContext) => {
            let info = chartData[item.dataIndex];
            return `${info.winRate}%`;
          },
        },
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          data: chartData.map((d) => d.trades.length - d.winCount),
          label: 'Total trades',
          stack: 'pair',
          color: theme.palette.grey[400],
        },
      ],
    } as BarChartProps;
  })();

  if (!chartProps) return null;

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex' })}>
      <BarChart borderRadius={2} {...chartProps} />
    </Box>
  );
};

export default ProfitablePairsChart;
