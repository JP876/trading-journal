import { memo } from 'react';

import WidgetContainer from '../WidgetContainer';
import PerformanceChart from './PerformanceChart';

const Performance = () => {
  return (
    <WidgetContainer
      title="Account Performance"
      description="See your trading P&L trend for the selected account and date range."
    >
      <PerformanceChart />
    </WidgetContainer>
  );
};

export default memo(Performance);
