import type { BarSeriesType, XAxis } from '@mui/x-charts';

export const DEFAULT_BAR_CHART_PROPS: { series: BarSeriesType; xAxis: XAxis } = {
  series: {
    type: 'bar',
    highlightScope: { highlight: 'series', fade: 'global' },
  },
  xAxis: {
    categoryGapRatio: 0.08,
    barGapRatio: 0,
    tickPlacement: 'end',
    tickLabelPlacement: 'tick',
  },
};
