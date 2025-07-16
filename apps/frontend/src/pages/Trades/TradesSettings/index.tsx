import { Stack } from '@mui/material';

import TabsNavigation from '@/components/TabsNavigation';
import AccountsMain from './Accounts';

const TradesSettings = () => {
  return (
    <Stack>
      <TabsNavigation tabItems={[{ label: 'Accounts', content: <AccountsMain /> }]} />
    </Stack>
  );
};

export default TradesSettings;
