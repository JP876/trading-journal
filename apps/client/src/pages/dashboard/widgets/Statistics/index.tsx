import WidgetContainer, { type TWidgetContainerProps } from '../WidgetContainer';
import StatisticsList from './StatisticsList';

type TStatisticsProps = {
  paperProps?: TWidgetContainerProps['paperProps'];
};

const Statistics = ({ paperProps }: TStatisticsProps) => {
  return (
    <WidgetContainer
      title="Trading Summary"
      description="Get an overview of your results, including win rate, average P&L, and trade count."
      paperProps={paperProps}
    >
      <StatisticsList />
    </WidgetContainer>
  );
};

export default Statistics;
