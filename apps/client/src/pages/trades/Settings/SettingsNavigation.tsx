import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TradingSessionsMain from './TradingSessions';

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel = ({ children, index, value }: TabPanelProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      sx={{ width: '100%' }}
    >
      {value === index && <Box sx={{ pl: 2, width: 'inherit' }}>{children}</Box>}
    </Box>
  );
};

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const SettingsNavigation = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Trades settings navigation"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '7.6rem', '& button': { pl: 0, ml: 0 } }}
      >
        <Tab label="Sessions" {...a11yProps(0)} />
        <Tab label="Tags" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TradingSessionsMain />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Tags
      </TabPanel>
    </Box>
  );
};

export default SettingsNavigation;
