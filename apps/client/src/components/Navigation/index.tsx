import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import { memo } from 'react';
import { Outlet } from 'react-router';

import { navigationDrawerAtom } from '../../atoms/navigationDrawer';
import { TradesPageModal } from '../../pages/trades/enums';
import DialogMain from '../DialogMain';
import ColorModeMain from './ColorMode';
import IntroForm from './Intro';
import NavigationList from './NavigationList';
import ProfileMain from './Profile';
import { AppBar, Drawer, DrawerHeader } from './styledComps';

const MainContainer = memo(() => {
  return (
    <Box sx={{ flexGrow: 1, p: 6, maxWidth: '1920px', margin: '0 auto' }}>
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
  const [drawer, setDrawer] = useAtom(navigationDrawerAtom);

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
            <MenuIcon />
          </IconButton>

          <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              <CandlestickChartIcon />
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
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <NavigationList />
      </Drawer>

      <NavigationModalList />
      <MainContainer />
    </Box>
  );
};

export default NavigationMain;
