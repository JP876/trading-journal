import WidgetContainer, { type TWidgetContainerProps } from '../WidgetContainer';
import ProfitablePairsChart from './ProfitablePairsChart';

type TProfitablePairsProps = {
  paperProps?: TWidgetContainerProps['paperProps'];
};

const ProfitablePairs = ({ paperProps }: TProfitablePairsProps) => {
  return (
    <WidgetContainer
      title="Most Profitable pairs"
      description="See which trading pairs generated the highest net profit"
      paperProps={paperProps}
    >
      <ProfitablePairsChart />
    </WidgetContainer>
  );
};

export default ProfitablePairs;
