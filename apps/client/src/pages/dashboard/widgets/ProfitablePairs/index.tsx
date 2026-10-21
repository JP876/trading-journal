import { memo } from 'react';

import WidgetContainer from '../WidgetContainer';
import ProfitablePairsChart from './ProfitablePairsChart';

const ProfitablePairs = () => {
  return (
    <WidgetContainer
      title="Most Profitable pairs"
      description="See which trading pairs generated the highest net profit"
    >
      <ProfitablePairsChart />
    </WidgetContainer>
  );
};

export default memo(ProfitablePairs);
