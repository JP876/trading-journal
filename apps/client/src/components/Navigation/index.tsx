import { memo, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { Outlet } from 'react-router';

import { AppBar, Drawer, DrawerHeader } from './styledComps';
import { navigationDrawer } from '../../atoms/navigationDrawer';
import getIcon from '../getIcon';
import NavigationList from './NavigationList';
import ProfileMain from './Profile';
import ColorModeMain from './ColorMode';
import { retryAtom } from '../../atoms/retry';
import useSnackbar from '../../hooks/useSnackbar';
import { RETRY_OPTIONS } from '../../lib/queryClient';

const RetryContainer = memo(() => {
  const retryInfo = useAtomValue(retryAtom);
  const { openSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (retryInfo.isRetrying) {
      openSnackbar({
        autoHideDuration: RETRY_OPTIONS.delay * RETRY_OPTIONS.count,
        severity: 'warning',
        message: `Request failed. Retrying... (attempt ${retryInfo.count} of ${RETRY_OPTIONS.count}; next retry in ${RETRY_OPTIONS.delay / 1_000} seconds)`,
      });
    } else {
      closeSnackbar();
    }
  }, [retryInfo.isRetrying, retryInfo.count]);

  return (
    <Backdrop
      sx={[(theme) => ({ color: theme.palette.grey[100], zIndex: theme.zIndex.drawer + 1 })]}
      open={retryInfo.isRetrying}
    >
      <CircularProgress color="inherit" size={60} />
    </Backdrop>
  );
});

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

      <RetryContainer />
      <MainContainer />
    </Box>
  );
};

export default NavigationMain;
