import { useTheme } from '@mui/material';
import { LineChart, type AxisValueFormatterContext, type LineChartProps } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { getTrades } from '../../../../api/trades';
import LoadingContainer from '../../../../components/feedback/LoadingContainer';
import { QueryKey } from '../../../../enums';
import useMainSession from '../../../../hooks/useMainSession';
import type { Trade } from '../../../../types/trade';
import { getPerformance } from '../../utils/performance';

const formatChartData = (trades: Trade[], accountSize: number) => {
  return getPerformance(trades, accountSize);
};

const PerformanceChart = () => {
  const theme = useTheme();
  const [mainSession] = useMainSession();

  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  const chartData = (() => {
    if (!Array.isArray(tradesQuery.data?.results) || !mainSession) return null;
    let chartData = formatChartData(tradesQuery.data.results, mainSession.accountSize);
    return chartData;
  })();

  const chartProps = (() => {
    if (!chartData || !mainSession) return null;

    return {
      dataset: chartData,
      series: [
        {
          id: 'pl',
          dataKey: 'pl',
          baseline: 'max',
          yAxisId: 'pl-axis',
        },
      ],
      yAxis: [
        {
          id: 'pl-axis',
          scaleType: 'linear',
          position: 'left',
          colorMap: {
            type: 'piecewise',
            thresholds: [mainSession.accountSize],
            colors: [theme.palette.error.main, theme.palette.success.main],
          },
        },
      ],
      margin: { left: 0, right: 0, bottom: 0, top: 28 },
      xAxis: [
        {
          dataKey: 'endDate',
          label: 'Date',
          scaleType: 'time',
          valueFormatter: (value: Date, context: AxisValueFormatterContext<'time'>) => {
            if (context.location === 'tooltip') {
              let date = format(value, 'dd/MM/yyyy HH:mm');
              return date;
            }
            return format(value, 'dd/MM');
          },
        },
      ],
      grid: { vertical: true, horizontal: true },
    } as LineChartProps;
  })();

  return (
    <LoadingContainer isLoading={tradesQuery.isPending}>
      <LineChart {...(chartProps || { series: [] })} />
    </LoadingContainer>
  );
};

export default PerformanceChart;
