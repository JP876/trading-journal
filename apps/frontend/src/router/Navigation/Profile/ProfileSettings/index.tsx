import { Stack } from '@mui/material';

import UserFormMain from './UsetForm';
import TabsNavigation, { tabItem } from '@/components/TabsNavigation';
import ProfileAvatarMain from '../ProfileAvatar';

const tabItems: tabItem[] = [{ label: 'User Info', content: UserFormMain }];

const ProfileSettings = () => {
  return (
    <Stack sx={{ width: '100%' }}>
      <ProfileAvatarMain />
      <TabsNavigation tabItems={tabItems} />
    </Stack>
  );
};

export default ProfileSettings;
