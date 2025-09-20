import NumOfTradesPerDateCalendar from './NumOfTradesPerDateCalendar';
import GroupedByResults from './GroupedByResults';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import GroupedByPairs from './GroupedByPairs';
import GeneralInfo from './GeneralInfo';

const StatsMain = () => {
  return (
    <ResponsiveGrid
      maxItemsPerRow={5}
      minWidthOfItem="22rem"
      gridGap="2rem"
      sx={{ gridAutoRows: 'minmax(240px, 400px)' }}
    >
      <NumOfTradesPerDateCalendar />
      <GroupedByResults />
      <GroupedByPairs />
      <GeneralInfo />
    </ResponsiveGrid>
  );
};

export default StatsMain;
