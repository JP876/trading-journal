import DashboardIcon from '@mui/icons-material/Dashboard';
import NotesIcon from '@mui/icons-material/Notes';
import { styled } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton, { type ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { memo } from 'react';
import { Link, useLocation } from 'react-router';

import { navigationDrawerAtom } from '../../atoms/navigationDrawer';

type TNavItem = { label: string; to: string; icon: React.ReactNode };

const navItems: TNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Trades', to: '/trades', icon: <NotesIcon /> },
];

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'active',
})<ListItemButtonProps<'button', { open: boolean; active: boolean }>>(({ theme, open, active }) => ({
  minHeight: 48,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['background-color', 'color']),
  justifyContent: open ? 'initial' : 'center',
  svg: {
    transition: theme.transitions.create(['color']),
  },
  ...(active && {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
    svg: {
      color: theme.palette.primary.main,
    },
  }),
}));

type TNavigationListItem = {
  label: string;
  to: string;
  activeLinkTo?: string;
  icon: React.ReactNode;
};

const NavigationListItem = ({ label, to, icon, activeLinkTo }: TNavigationListItem) => {
  const drawer = useAtomValue(navigationDrawerAtom);
  let open = !!drawer?.open;

  return (
    <Tooltip arrow placement="right" title={!!open ? '' : <Typography variant="body1">{label}</Typography>}>
      <ListItem component={Link} to={to} viewTransition disablePadding sx={{ display: 'block' }}>
        <StyledListItemButton disableRipple active={activeLinkTo === to} open={!!open}>
          <ListItemIcon sx={[{ minWidth: 0, justifyContent: 'center' }, open ? { mr: 3 } : { mr: 'auto' }]}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={label} sx={{ opacity: +!!open }} />
        </StyledListItemButton>
      </ListItem>
    </Tooltip>
  );
};

const NavigationList = () => {
  const location = useLocation();

  const activeLink: TNavItem | undefined = (() => {
    return navItems.find(({ to }) => location.pathname.includes(to));
  })();

  return (
    <List>
      {navItems.map(({ label, to, icon }) => (
        <NavigationListItem key={label} label={label} to={to} icon={icon} activeLinkTo={activeLink?.to} />
      ))}
    </List>
  );
};

export default memo(NavigationList);
