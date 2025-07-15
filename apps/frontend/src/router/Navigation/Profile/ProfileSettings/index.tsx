import { ReactNode, SyntheticEvent, useState } from 'react';
import { Box, BoxProps, Stack, Tab, Tabs } from '@mui/material';

import UserFormMain from './UsetForm';

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

type TabPanelProps = {
  children: ReactNode;
  index: number;
  value: number;
};

const TabPanel = ({ index, value, children, ...rest }: TabPanelProps & BoxProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...rest}
    >
      {value === index && <Box sx={{ py: 2, pl: 4 }}>{children}</Box>}
    </Box>
  );
};

const ProfileSettingsNavigation = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack direction="row" sx={{ width: '100%', flexGrow: 1 }}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '22%', '& button': { pl: 0 } }}
      >
        <Tab label="User info" {...a11yProps(0)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <UserFormMain />
      </TabPanel>
    </Stack>
  );
};

const ProfileSettings = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <ProfileSettingsNavigation />
    </Box>
  );
};

export default ProfileSettings;
