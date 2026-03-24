import { memo } from 'react';
import { Box, Divider, IconButton, Stack, Toolbar, Typography, useTheme } from '@mui/material';
import { useAtom } from 'jotai';
import { Outlet } from 'react-router';

import { AppBar, Drawer, DrawerHeader } from './styledComps';
import { navigationDrawer } from '../../atoms/navigationDrawer';
import getIcon from '../getIcon';
import NavigationList from './NavigationList';
import ProfileMain from './Profile';
import ColorModeMain from './ColorMode';

const MainContainer = memo(() => {
  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <DrawerHeader />
      <Outlet />
    </Box>
  );
});

const NavigationMain = () => {
  const theme = useTheme();
  const [drawer, setDrawer] = useAtom(navigationDrawer);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={!!drawer?.open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setDrawer({ open: true })}
            edge="start"
            sx={[{ mr: 5 }, !!drawer?.open && { display: 'none' }]}
          >
            {getIcon('menu')}
          </IconButton>

          <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              {getIcon('candlestick')}
              <Typography variant="h6">LogMyTrades</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={4}>
              <ColorModeMain />
              <ProfileMain />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={!!drawer?.open}>
        <DrawerHeader>
          <IconButton onClick={() => setDrawer({ open: false })}>
            {theme.direction === 'rtl' ? getIcon('chevronRight') : getIcon('chevronLeft')}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <NavigationList open={!!drawer?.open} />
      </Drawer>

      <MainContainer />
    </Box>
  );
};

export default NavigationMain;
