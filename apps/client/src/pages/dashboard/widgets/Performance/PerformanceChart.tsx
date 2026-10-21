import { LineChart, type AxisValueFormatterContext, type LineChartProps } from '@mui/x-charts';
import { useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import { getTrades } from '../../../../api/trades';
import LoadingContainer from '../../../../components/feedback/LoadingContainer';
import { QueryKey } from '../../../../enums';
import { queryClient } from '../../../../lib/queryClient';
import type { Trade } from '../../../../types/trade';
import type { TradingSessionsResult } from '../../../../types/tradingSessions';

type TPerformanceChartData = { pl: number; plPercentage: number; endDate: Date };

const formatChartData = (trades: Trade[], accountSize: number): TPerformanceChartData[] => {
  let startBalance = accountSize;
  let firstTradeIndex = trades.findIndex((t) => t.closeDate);

  let finalData: TPerformanceChartData[] = [];
  finalData.push({
    pl: accountSize,
    plPercentage: 0,
    endDate: subDays(new Date(trades[firstTradeIndex].closeDate!), 1),
  });

  for (let i = firstTradeIndex; i < trades.length; i++) {
    let trade = trades[i];
    if (!trade?.profit || !trade?.closeDate) {
      continue;
    }

    let nextPl = startBalance + trade.profit;
    let plPercentage = nextPl / accountSize - 1;

    finalData.push({
      pl: nextPl,
      plPercentage: +plPercentage.toFixed(4),
      endDate: new Date(trade.closeDate),
    });
    startBalance = nextPl;
  }

  return finalData;
};

const PerformanceChart = () => {
  const theme = useTheme();

  const sessions = queryClient.getQueryData<TradingSessionsResult>([QueryKey.TRADING_SESSIONS]);
  const mainSession = sessions?.results?.find((el) => el?.isMain);

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
