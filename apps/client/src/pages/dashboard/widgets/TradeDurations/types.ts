import type { SeriesItem } from '@mui/x-charts';
import type { TDurationAnalysisValue } from '../../utils/types';

export type TTradeDurationsChartProps = {
  period?: number;
};

export type TTradeDurationsTooltipContentProps = {
  data: TTransformedDataItem;
  title: string;
  seriesItems: SeriesItem<'bar'>[];
};

export type TTransformedDataItem = {
  interval: {
    start: string;
    startSec: number;
    end: string;
    endSec: number;
  };
  win: TDurationAnalysisValue['trades'];
  loss: TDurationAnalysisValue['trades'];
};

export type TTradeDurationsTooltipProps = {
  chartData: TTransformedDataItem[];
};
