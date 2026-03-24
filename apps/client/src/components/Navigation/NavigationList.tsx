import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router';

import getIcon from '../getIcon';

type NavItem = { label: string; to: string; icon: React.ReactNode };

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: getIcon('dashboard') },
  { label: 'Trades', to: '/trades', icon: getIcon('notes') },
  // { label: 'Strategies', to: '/strategies', icon: getIcon('appRegistration')},
];

const NavigationList = ({ open }: { open: boolean }) => {
  const location = useLocation();
  const activeLink: NavItem | undefined = navItems.find(({ to }) => location.pathname.includes(to));

  return (
    <List>
      {navItems.map(({ label, to, icon }) => (
        <Tooltip
          key={label}
          arrow
          placement="right"
          title={open ? '' : <Typography variant="body1">{label}</Typography>}
        >
          <ListItem component={Link} to={to} viewTransition disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              disableRipple
              sx={[
                (theme) => ({
                  minHeight: 48,
                  color: theme.palette.text.primary,
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

export default NavigationList;
