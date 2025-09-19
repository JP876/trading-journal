import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { SeriesValueFormatterContext } from '@mui/x-charts/internals';

import { getGroupedTradesByPair } from '@/api/trades';
import StatsContainer from './StatsContainer';
import { TradeResult } from '@/types/trades';

const GroupedByPairs = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'grouped-by-pair'],
    queryFn: getGroupedTradesByPair,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const theme = useTheme();

  const formatedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((el) => {
        const totalCount = el.results.reduce((acc, el) => acc + el.count, 0);
        return {
          pair: el.pair,
          totalCount,
          be: el.results.find((res) => res.result === TradeResult.BE)?.count || 0,
          win: el.results.find((res) => res.result === TradeResult.WIN)?.count || 0,
          loss: el.results.find((res) => res.result === TradeResult.LOSS)?.count || 0,
        };
      })
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [data]);

  const getValueFormater = useCallback(
    (v: number | null, context: SeriesValueFormatterContext) => {
      const data = formatedData?.[context.dataIndex];
      if (v === null) return '-';
      const percentage = +((v / data.totalCount) * 100).toFixed(2);
      return `${percentage}%`;
    },
    [formatedData]
  );

  return (
    <StatsContainer title="Profitability per trading pair" isLoading={isLoading}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <BarChart
          height={320}
          dataset={formatedData}
          layout="horizontal"
          yAxis={[{ scaleType: 'band', dataKey: 'pair', width: 80 }]}
          xAxis={[{ label: 'Number of trades', height: 44 }]}
          series={[
            {
              dataKey: 'win',
              stack: 'pair',
              label: 'WIN',
              color: theme.palette.success.light,
              valueFormatter: getValueFormater,
            },
            {
              dataKey: 'be',
              stack: 'pair',
              label: 'BE',
              color: theme.palette.grey[300],
              valueFormatter: getValueFormater,
            },
            {
              dataKey: 'loss',
              stack: 'pair',
              label: 'LOSS',
              color: theme.palette.error.main,
              valueFormatter: getValueFormater,
            },
          ]}
          grid={{ vertical: true }}
          margin={{ left: 0 }}
        />
      </Box>
    </StatsContainer>
  );
};

export default GroupedByPairs;
