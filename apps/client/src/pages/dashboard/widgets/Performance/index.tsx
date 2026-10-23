import WidgetContainer, { type TWidgetContainerProps } from '../WidgetContainer';
import PerformanceChart from './PerformanceChart';

type TPerformanceProps = {
  paperProps?: TWidgetContainerProps['paperProps'];
};

const Performance = ({ paperProps }: TPerformanceProps) => {
  return (
    <WidgetContainer
      title="Account Performance"
      description="See your trading P&L trend for the selected account and date range."
      paperProps={paperProps}
    >
      <PerformanceChart />
    </WidgetContainer>
  );
};

export default Performance;
