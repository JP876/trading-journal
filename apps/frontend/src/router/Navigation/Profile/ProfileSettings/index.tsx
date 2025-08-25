import { Box } from '@mui/material';

import UserFormMain from './UsetForm';
import TabsNavigation, { tabItem } from '@/components/TabsNavigation';
import ProfileAvatarMain from '../ProfileAvatar';

const tabItems: tabItem[] = [
  { label: 'User Info', content: UserFormMain },
  { label: 'Profile Picture', content: ProfileAvatarMain },
];

const ProfileSettings = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <TabsNavigation tabItems={tabItems} />
    </Box>
  );
};

export default ProfileSettings;
