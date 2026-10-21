import { memo } from 'react';

import WidgetContainer from '../WidgetContainer';
import ConsecutiveTradesChart from './ConsecutiveTradesChart';

const ConsecutiveTrades = () => {
  return (
    <WidgetContainer
      title="Consecutive trades"
      description="View how often your trades cluster into winning or losing streaks"
    >
      <ConsecutiveTradesChart />
    </WidgetContainer>
  );
};

export default memo(ConsecutiveTrades);
