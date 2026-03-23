import {
  Badge,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  type DividerProps,
} from '@mui/material';

import getIcon from '../getIcon';
import type { MenuActionsItemProps, MenuActionsProps } from './types';
import { MenuActionsProvider, useMenuActionsContext } from './MenuActionsProvider';

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
  const { handleClose } = useMenuActionsContext();

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
  const { anchorEl, handleClick, handleClose } = useMenuActionsContext();

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
    <MenuActionsProvider>
      <MenuActionsMain {...props} />
    </MenuActionsProvider>
  );
};

MenuActions.Item = ({ ...props }: MenuActionsItemProps) => <MenuActionsItem {...props} />;
MenuActions.Divider = ({ ...rest }: DividerProps) => <Divider sx={{ mx: -0.5 }} {...rest} />;

export default MenuActions;
