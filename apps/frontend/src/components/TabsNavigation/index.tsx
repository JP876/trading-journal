import React, { useState } from 'react';
import { Box, Stack, Tab, Tabs, type TabsProps, type BoxProps, StackProps } from '@mui/material';

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: number;
};

type setValue = React.Dispatch<React.SetStateAction<number>>;

export type tabItem = {
  label: string;
  content: React.ReactNode | ((options: { value: number; setValue: setValue }) => React.ReactNode);
};

type TabsNavigationProps = {
  containerProps?: StackProps;
  tabsProps?: Omit<TabsProps, 'value'>;
  tabItems: tabItem[];
};

const TabPanel = ({ index, value, children, ...rest }: TabPanelProps & BoxProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...rest}
      sx={{ width: '100%' }}
    >
      {value === index && <Box sx={{ py: 1, pl: 4, width: '100%' }}>{children}</Box>}
    </Box>
  );
};

const TabsNavigation = ({ containerProps, tabsProps, tabItems }: TabsNavigationProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (typeof tabsProps?.onChange === 'function') {
      tabsProps.onChange(event, newValue);
    }
  };

  return (
    <Stack {...containerProps} direction="row" sx={{ width: '100%', flexGrow: 1, ...containerProps?.sx }}>
      <Tabs
        orientation="vertical"
        aria-label="Tabs Navigation"
        {...tabsProps}
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '7.2rem', ...tabsProps?.sx }}
        value={value}
        onChange={handleChange}
      >
        {tabItems.map((item, index) => (
          <Tab key={`tab-${item.label}`} label={item.label} {...a11yProps(index)} />
        ))}
      </Tabs>

      {tabItems.map((item, index) => (
        <TabPanel key={`panel-${item.label}`} value={value} index={index}>
          {typeof item.content === 'function' ? item.content({ value, setValue }) : item.content}
        </TabPanel>
      ))}
    </Stack>
  );
};

export default TabsNavigation;
