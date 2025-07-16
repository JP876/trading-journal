import { Box } from '@mui/material';

import UserFormMain from './UsetForm';
import TabsNavigation from '@/components/TabsNavigation';

const tabItems = [{ label: 'User Info', content: UserFormMain }];

const ProfileSettings = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <TabsNavigation tabItems={tabItems} />
    </Box>
  );
};

export default ProfileSettings;
