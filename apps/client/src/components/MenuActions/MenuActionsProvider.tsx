import { createContext, useCallback, useContext, useState } from 'react';

import type { MenuActionsProviderValue } from './types';

const MenuActionsContext = createContext<MenuActionsProviderValue | null>(null);

export const useMenuActionsContext = () => {
  const ctx = useContext(MenuActionsContext);
  if (!ctx) {
    throw new Error('useMenuActionsContext must be used within MenuActionsProvider');
  }
  return ctx;
};

export const MenuActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <MenuActionsContext.Provider value={{ anchorEl, handleClick, handleClose }}>{children}</MenuActionsContext.Provider>
  );
};
