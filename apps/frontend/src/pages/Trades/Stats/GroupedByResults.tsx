import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, useTheme } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { PieValueType } from '@mui/x-charts';

import { getGroupedTradesByResult } from '@/api/trades';
import { TradeResult } from '@/types/trades';
import StatsContainer from './StatsContainer';

const GroupedByResults = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stats', 'grouped-by-result'],
    queryFn: getGroupedTradesByResult,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const theme = useTheme();

  const formatedData: PieValueType[] = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const totalCount = data.reduce((acc, el) => acc + el.count, 0);

    return data.map((d) => {
      let color = '';
      const percentage = +((d.count / totalCount) * 100).toFixed(2);

      switch (d._id) {
        case TradeResult.WIN:
          color = theme.palette.success.light;
          break;
        case TradeResult.LOSS:
          color = theme.palette.error.main;
          break;
        case TradeResult.BE:
        default:
          color = theme.palette.grey[300];
      }

      return { id: d._id, value: percentage, label: `${d._id.toUpperCase()}`, color };
    });
  }, [data, theme]);

  return (
    <StatsContainer isLoading={isLoading} title="Profitability">
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <PieChart width={240} height={240} series={[{ data: formatedData, arcLabel: (item) => `${item.value}%` }]} />
      </Box>
    </StatsContainer>
  );
};

export default GroupedByResults;
