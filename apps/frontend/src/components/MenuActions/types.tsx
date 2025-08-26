import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { MenuProps } from '@mui/material/Menu';
import { DividerProps } from '@mui/material/Divider';
import { MenuItemProps } from '@mui/material/MenuItem';
import { BadgeProps } from '@mui/material/Badge';

export type reasonType = 'escapeKeyDown' | 'backdropClick' | 'tabKeyDown' | undefined;
export type handleCloseType = (e?: React.MouseEvent<HTMLElement>, reason?: reasonType) => void;
export type renderMenuBtnType = {
  handleClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleClose: handleCloseType;
  open: boolean;
};

export type menuActionType<T = string> = {
  id: T;
  icon?: ReactNode;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>, handleClose: handleCloseType) => void;
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
  renderMenuBtn?: (options: renderMenuBtnType) => ReactNode;
  onOpen?: (e: React.MouseEvent<HTMLElement>) => void;
  onClose?: (e?: React.MouseEvent<HTMLElement> | {}, reason?: reasonType) => void;
};
