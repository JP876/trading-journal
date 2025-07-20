import { memo, ReactNode, useState } from 'react';
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotesIcon from '@mui/icons-material/Notes';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import { Link, Outlet, useLocation } from 'react-router';

import { AppBar, Drawer, DrawerHeader } from './styledComps';
import ProfileMain from './Profile';
import ColorModeMain from './ColorMode';

type navItem = { label: string; to: string; icon: ReactNode };

const navItems: navItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Trades', to: '/trades', icon: <NotesIcon /> },
  { label: 'Strategies', to: '/strategies', icon: <AppRegistrationIcon /> },
];

const NavigationList = ({ open }: { open: boolean }) => {
  const location = useLocation();
  const activeLink: navItem | undefined = navItems.find(({ to }) => location.pathname.includes(to));

  return (
    <List>
      {navItems.map(({ label, to, icon }) => (
        <Tooltip
          key={label}
          arrow
          placement="right"
          title={open ? '' : <Typography variant="body1">{label}</Typography>}
        >
          <ListItem component={Link} discover="none" to={to} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              disableRipple
              sx={[
                (theme) => ({
                  minHeight: 48,
                  transition: theme.transitions.create(['background-color', 'color']),
                  svg: {
                    transition: theme.transitions.create(['color']),
                  },
                }),
                open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                activeLink?.to === to &&
                  ((theme) => ({
                    backgroundColor: theme.palette.action.selected,
                    color: theme.palette.primary.main,
                    svg: {
                      color: theme.palette.primary.main,
                    },
                  })),
              ]}
            >
              <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, open ? { mr: 3 } : { mr: 'auto' }]}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} sx={{ opacity: +open }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
      ))}
    </List>
  );
};

type navigationValueType = 'true' | 'false' | undefined;

const MainContainer = memo(() => {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
      <DrawerHeader />
      <Outlet />
    </Box>
  );
});

const NavigationMain = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(() => {
    const initialValue = localStorage.getItem('navigation-open') as navigationValueType;
    return initialValue === 'true';
  });

  const handleDrawerOpen = () => {
    localStorage.setItem('navigation-open', 'true');
    setOpen(true);
  };

  const handleDrawerClose = () => {
    localStorage.setItem('navigation-open', 'false');
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ mr: 5 }, open && { display: 'none' }]}
          >
            <MenuIcon />
          </IconButton>

          <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              <CandlestickChartIcon />
              <Typography variant="h6">Trading Journal</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" gap={4}>
              <ColorModeMain />
              <ProfileMain />
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <NavigationList open={open} />
      </Drawer>

      <MainContainer />
    </Box>
  );
};

export default NavigationMain;
