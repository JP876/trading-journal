import type { BadgeProps, IconButtonProps, MenuItemProps, MenuProps } from '@mui/material';

export type MenuActionsProps = {
  children: React.ReactNode;
  menuProps?: MenuProps;
  btnProps?: IconButtonProps;
  renderMenuBtn?: () => React.ReactNode;
};

export type ReasonType = 'escapeKeyDown' | 'backdropClick' | 'tabKeyDown' | undefined;

export type MenuActionsProviderValue = {
  anchorEl: HTMLElement | null;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
};

export type MenuActionsItemProps = {
  label: string;
  icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, handleClose: () => void) => void;
  isLoading?: boolean;
  menuItemProps?: Omit<MenuItemProps, 'onClick'>;
  badgeContent?: number;
  badgeProps?: Omit<BadgeProps, 'badgeContent'>;
};
