import { useTheme } from '@mui/material';
import type { AxisValueFormatterContext, ChartsAxisData } from '@mui/x-charts';
import { BarChart, barClasses, type BarChartProps } from '@mui/x-charts/BarChart';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';

import { getTrades } from '../../../../api/trades';
import LoadingContainer from '../../../../components/feedback/LoadingContainer';
import { QueryKey } from '../../../../enums';
import { DEFAULT_BAR_CHART_PROPS } from '../../consts';
import { formatSeconds, getTradeDurationAnalysis, getTradeDurationInfo } from '../../utils/duration';
import type { TDurationAnalysis } from '../../utils/types';
import { periodsAtom, periodsCountAtom, tradeDurationsChartStore, updatePeriodsAtom } from './atoms';
import type { TTradeDurationsTooltipProps, TTransformedDataItem } from './types';

declare module '@mui/x-charts' {
  interface TooltipPropsOverrides extends TTradeDurationsTooltipProps {}
}

const transformData = (analysis: TDurationAnalysis, shortest: number = 0) => {
  const intervals = Object.keys(analysis);
  let data, start, end, startSec;

  return intervals.reduce((prev, curr, index) => {
    data = analysis[curr];

    startSec = +(intervals[index - 1] ?? shortest);
    start = formatSeconds(startSec, { excludeSeconds: true });
    end = formatSeconds(+curr, { excludeSeconds: true });

    return [
      ...prev,
      {
        interval: { start, startSec, end, endSec: +curr },
        win: data.trades.filter((t) => t.result === 'win'),
        loss: data.trades.filter((t) => t.result === 'loss'),
      },
    ];
  }, [] as TTransformedDataItem[]);
};

const TradeDurationsChart = () => {
  const theme = useTheme();

  const period = useAtomValue(periodsAtom, { store: tradeDurationsChartStore });
  const periodsCount = useAtomValue(periodsCountAtom, { store: tradeDurationsChartStore });
  const updatePeriods = useSetAtom(updatePeriodsAtom, { store: tradeDurationsChartStore });

  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  const chartData = (() => {
    if (!tradesQuery.data?.results) return null;

    let shortestDuration = period?.[0];
    let longestDuration = period?.[1];

    if (!shortestDuration || !longestDuration) {
      const durationInfo = getTradeDurationInfo(tradesQuery.data.results);
      shortestDuration = durationInfo.shortest.duration;
      longestDuration = durationInfo.longest.duration;
    }

    const analysis = getTradeDurationAnalysis(tradesQuery.data?.results || [], {
      maxIntervals: +periodsCount + 1,
      shortestDuration,
      longestDuration,
    });

    return transformData(analysis, shortestDuration);
  })();

  const chartProps = (() => {
    if (!chartData) return null;

    return {
      dataset: chartData,
      xAxis: [
        {
          ...DEFAULT_BAR_CHART_PROPS.xAxis,
          data: chartData.map((d) => d.interval),
          label: 'Periods',
          tickPlacement: 'end',
          tickLabelPlacement: 'tick',
          valueFormatter: (value: TTransformedDataItem['interval'], context: AxisValueFormatterContext) => {
            if (context.location === 'tooltip') {
              return `Period: ${value.start} - ${value.end}`;
            }
            return value.end;
          },
        },
      ],
      yAxis: [{ label: 'Trades count', width: 48 }],
      margin: 0,
      series: [
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          id: 'WON_TRADES',
          data: chartData.map((d) => d.win.length),
          label: 'Won trades',
          color: theme.palette.success.main,
        },
        {
          ...DEFAULT_BAR_CHART_PROPS.series,
          id: 'LOST_TRADES',
          data: chartData.map((d) => d.loss.length),
          label: 'Lost trades',
          color: theme.palette.error.main,
        },
      ],
      sx: [{ [`& .${barClasses.series}`]: { cursor: 'pointer' } }],
      // slots: { tooltip: TradeDurationsTooltip },
      // slotProps: { tooltip: { chartData } },
    } as BarChartProps;
  })();

  const handleAxisClick = (_: MouseEvent, params: ChartsAxisData | null) => {
    if (params && chartData) {
      const data = chartData[params.dataIndex];

      // check if there is 5 min difference between end and start
      if (data.interval.endSec - data.interval.startSec > 60 * 5 && (data.loss.length > 0 || data.win.length > 0)) {
        updatePeriods([+data.interval.startSec, +data.interval.endSec]);
      }
    }
  };

  return (
    <LoadingContainer isLoading={tradesQuery.isPending}>
      <BarChart onAxisClick={handleAxisClick} borderRadius={2} {...(chartProps || { series: [] })} />
    </LoadingContainer>
  );
};

export default TradeDurationsChart;
