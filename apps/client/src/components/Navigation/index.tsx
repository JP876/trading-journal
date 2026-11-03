import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import { memo } from 'react';
import { Outlet } from 'react-router';

import { navigationDrawer } from '../../atoms/navigationDrawer';
import getIcon from '../getIcon';
import ColorModeMain from './ColorMode';
import NavigationList from './NavigationList';
import ProfileMain from './Profile';
import { AppBar, Drawer, DrawerHeader } from './styledComps';
import DialogMain from '../DialogMain';
import { TradesPageModal } from '../../pages/trades/enums';
import IntroForm from './Intro';

const MainContainer = memo(() => {
  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <DrawerHeader />
      <Outlet />
    </Box>
  );
});

const NavigationModalList = memo(() => {
  return (
    <>
      <DialogMain size="sm" id={TradesPageModal.INTRO} title="You're exploring as a guest">
        <IntroForm />
      </DialogMain>
    </>
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

      <NavigationModalList />
      <MainContainer />
    </Box>
  );
};

export default NavigationMain;
