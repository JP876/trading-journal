import { ReactNode, useEffect, useState } from 'react';
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

type navItem = { label: string; to: string; icon: ReactNode };

const navItems: navItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Trades', to: '/trades', icon: <NotesIcon /> },
  { label: 'Strategies', to: '/strategies', icon: <AppRegistrationIcon /> },
];

const NavigationList = ({ open }: { open: boolean }) => {
  const [activeLink, setActiveLink] = useState<navItem | undefined>();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(navItems.find(({ to }) => location.pathname.includes(to)));
  }, [location.pathname]);

  return (
    <List>
      {navItems.map(({ label, to, icon }) => (
        <ListItem component={Link} discover="none" to={to} key={label} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            disableRipple
            sx={[
              {
                minHeight: 48,
                transition: (theme) => theme.transitions.create(['background-color', 'color']),
                svg: {
                  transition: (theme) => theme.transitions.create(['color']),
                },
              },
              open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
              activeLink?.to === to && {
                backgroundColor: (theme) => theme.palette.grey[200],
                color: (theme) => theme.palette.primary.main,
                svg: {
                  color: (theme) => theme.palette.primary.main,
                },
              },
            ]}
          >
            <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, open ? { mr: 3 } : { mr: 'auto' }]}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} sx={{ opacity: +open }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const NavigationMain = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

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
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={1}>
              <CandlestickChartIcon />
              <Typography variant="h6">Trading Journal</Typography>
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default NavigationMain;
