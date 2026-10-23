import WidgetContainer, { type TWidgetContainerProps } from '../WidgetContainer';
import ConsecutiveTradesChart from './ConsecutiveTradesChart';

type TConsecutiveTradesProps = {
  paperProps?: TWidgetContainerProps['paperProps'];
};

const ConsecutiveTrades = ({ paperProps }: TConsecutiveTradesProps) => {
  return (
    <WidgetContainer
      title="Consecutive trades"
      description="View how often your trades cluster into winning or losing streaks"
      paperProps={paperProps}
    >
      <ConsecutiveTradesChart />
    </WidgetContainer>
  );
};

export default ConsecutiveTrades;
