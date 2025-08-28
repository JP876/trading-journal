import { Stack } from '@mui/material';

import TabsNavigation from '@/components/TabsNavigation';
import AccountsMain from './Accounts';
import TagsMain from './Tags';

const TradesSettings = () => {
  return (
    <Stack>
      <TabsNavigation
        tabItems={[
          { label: 'Accounts', content: <AccountsMain /> },
          { label: 'Tags', content: <TagsMain /> },
        ]}
      />
    </Stack>
  );
};

export default TradesSettings;
