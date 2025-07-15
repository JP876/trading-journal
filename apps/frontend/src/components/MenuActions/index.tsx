import { useState } from 'react';
import { Box, CircularProgress, ListItemIcon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { buttonClickEvent, handleCloseType, menuActionsPropsType, menuActionType, reasonType } from './types';

export const itemMenuTypeIds = {
  divider: 'divider',
  customItem: 'custom-item',
};

export const MenuActionsList = ({
  actions,
  handleClose,
}: {
  actions: menuActionType[];
  handleClose: handleCloseType;
}) => {
  if (!Array.isArray(actions) || actions.length === 0 || typeof handleClose !== 'function') {
    return null;
  }

  return actions.map((action) => {
    if (action.id.includes(itemMenuTypeIds.divider)) {
      return <Divider key={action.id} {...action?.dividerProps} sx={{ mx: -0.5 }} />;
    }

    if (action.id.includes(itemMenuTypeIds.customItem)) {
      if (typeof action?.renderAction === 'function') {
        return <Box key={action.id}>{action.renderAction(handleClose)}</Box>;
      } else {
        console.error(`Function renderAction not found`);
        return null;
      }
    }

    return (
      <MenuItem
        key={action.id}
        sx={{ width: '100%' }}
        onClick={(e) => typeof action?.onClick === 'function' && action.onClick(e, () => handleClose(e))}
        disabled={action?.isLoading}
        disableRipple
        {...action?.menuItemProps}
      >
        {action?.isLoading ? (
          <CircularProgress size={24} sx={{ mr: 1.6 }} />
        ) : (
          <Badge
            badgeContent={action?.badgeContent}
            color="primary"
            {...(action?.badgeProps || {})}
            sx={{ '& .MuiBadge-badge': { right: '10px' }, ...(action?.badgeProps?.sx || {}) }}
          >
            <ListItemIcon>{action.icon}</ListItemIcon>
          </Badge>
        )}
        {action.label}
      </MenuItem>
    );
  });
};

const MenuActions = (props: menuActionsPropsType) => {
  const { menuActions, btnProps, openMenu, setOpenMenu, renderMenuBtn, onOpen, onClose, menuProps, children } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: buttonClickEvent) => {
    event.stopPropagation();
    typeof onOpen === 'function'
      ? onOpen(event)
      : typeof setOpenMenu === 'function'
        ? setOpenMenu(event.currentTarget)
        : setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: {} | undefined, reason: reasonType) => {
    typeof onClose === 'function'
      ? onClose(event, reason)
      : typeof setOpenMenu === 'function'
        ? setOpenMenu(null)
        : setAnchorEl(null);
  };

  if (menuActions === null) {
    return null;
  }

  return (
    <>
      {typeof renderMenuBtn === 'function' ? (
        renderMenuBtn({ handleClick, handleClose, open: Boolean(openMenu || anchorEl) })
      ) : (
        <IconButton size="small" aria-label="settings" {...btnProps} onClick={handleClick}>
          {children || <MoreVertIcon />}
        </IconButton>
      )}

      <Menu
        id="tree-item-menu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        {...menuProps}
        anchorEl={openMenu || anchorEl}
        open={Boolean(openMenu || anchorEl)}
        onClose={handleClose}
      >
        <MenuActionsList actions={menuActions} handleClose={handleClose} />
      </Menu>
    </>
  );
};

export default MenuActions;
