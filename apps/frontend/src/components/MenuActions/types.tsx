import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { MenuProps } from '@mui/material/Menu';
import { DividerProps } from '@mui/material/Divider';
import { MenuItemProps } from '@mui/material/MenuItem';
import { BadgeProps } from '@mui/material/Badge';

export type reasonType = 'escapeKeyDown' | 'backdropClick' | 'tabKeyDown' | undefined;
export type buttonClickEvent = React.MouseEvent<HTMLElement>;
export type handleCloseType = (e?: buttonClickEvent, reason?: reasonType) => void;

export type menuActionType = {
  id: string;
  icon: ReactNode;
  label: string;
  onClick: (e: buttonClickEvent, handleClose: handleCloseType) => void;
  renderAction?: (handleClose: handleCloseType) => ReactNode;
  isLoading?: boolean;
  dividerProps?: DividerProps;
  menuItemProps?: MenuItemProps;
  badgeContent?: ReactNode;
  badgeProps?: BadgeProps;
};

export type menuActionsPropsType = {
  menuActions: menuActionType[];
  btnProps?: IconButtonProps;
  menuProps?: MenuProps;
  children?: ReactNode;
  openMenu?: null | HTMLElement;
  setOpenMenu?: Dispatch<SetStateAction<null | HTMLElement>>;
  renderMenuBtn?: ({}) => ReactNode;
  onOpen?: (e: buttonClickEvent) => void;
  onClose?: (e?: buttonClickEvent | {}, reason?: reasonType) => void;
};
