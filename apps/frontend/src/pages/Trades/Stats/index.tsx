import NumOfTradesPerDateCalendar from './NumOfTradesPerDateCalendar';
import GroupedByResults from './GroupedByResults';
import ResponsiveGrid from '@/components/ResponsiveGrid';

const StatsMain = () => {
  return (
    <ResponsiveGrid maxItemsPerRow={5} minWidthOfItem="22rem" gridGap="2rem">
      <NumOfTradesPerDateCalendar />
      <GroupedByResults />
    </ResponsiveGrid>
  );
};

export default StatsMain;
