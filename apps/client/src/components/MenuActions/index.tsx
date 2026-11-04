import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import Divider, { type DividerProps } from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Provider, useAtomValue } from 'jotai';

import getIcon from '../getIcon';
import { anchorElAtom } from './atoms';
import useMenuActions from './hooks/useMenuActions';
import type { MenuActionsItemProps, MenuActionsProps } from './types';

const MenuActionsItem = ({
  menuItemProps,
  isLoading,
  label,
  icon,
  id,
  onClick,
  badgeContent,
  badgeProps,
}: MenuActionsItemProps) => {
  const { handleClose } = useMenuActions();

  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    onClick(event, handleClose);
  };

  return (
    <MenuItem
      id={id || `menu-item-${label}`}
      sx={{ width: '100%' }}
      disableRipple
      {...menuItemProps}
      disabled={isLoading || menuItemProps?.disabled}
      onClick={handleClick}
    >
      {isLoading ? (
        <CircularProgress size={24} sx={{ mr: 1.6 }} />
      ) : (
        <Badge
          badgeContent={badgeContent}
          color="primary"
          {...(badgeProps || {})}
          sx={{ '& .MuiBadge-badge': { right: '10px' }, ...(badgeProps?.sx || {}) }}
        >
          <ListItemIcon>{icon}</ListItemIcon>
        </Badge>
      )}
      {label}
    </MenuItem>
  );
};

const MenuActionsMain = ({ children, menuProps, btnProps, renderMenuBtn }: MenuActionsProps) => {
  const anchorEl = useAtomValue(anchorElAtom);
  const { handleClick, handleClose } = useMenuActions();

  return (
    <>
      {renderMenuBtn ? (
        renderMenuBtn()
      ) : (
        <IconButton size="small" aria-label="settings" {...btnProps} onClick={handleClick}>
          {btnProps?.children || getIcon('moreVert')}
        </IconButton>
      )}

      <Menu
        id="tree-item-menu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        {...menuProps}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  );
};

const MenuActions = ({ ...props }: MenuActionsProps) => {
  return (
    <Provider>
      <MenuActionsMain {...props} />
    </Provider>
  );
};

MenuActions.Item = ({ ...props }: MenuActionsItemProps) => <MenuActionsItem {...props} />;
MenuActions.Divider = ({ ...rest }: DividerProps) => <Divider sx={{ mx: -0.5 }} {...rest} />;

export default MenuActions;
