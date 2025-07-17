import { useMemo } from 'react';
import { Button, useColorScheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoModeIcon from '@mui/icons-material/AutoMode';

import MenuActions from '@/components/MenuActions';
import { menuActionType } from '@/components/MenuActions/types';

const ColorModeMain = () => {
  const { mode, setMode } = useColorScheme();

  const buttonIcon = (() => {
    switch (mode) {
      case 'dark':
        return <DarkModeIcon />;
      case 'light':
        return <LightModeIcon />;
      default:
        return <AutoModeIcon />;
    }
  })();

  const menuActions = useMemo<menuActionType[]>(() => {
    const handleOnChange = (value: 'system' | 'light' | 'dark') => setMode(value);

    return [
      { id: 'light', label: 'Light', icon: <LightModeIcon fontSize="small" />, onClick: () => handleOnChange('light') },
      { id: 'dark', label: 'Dark', icon: <DarkModeIcon fontSize="small" />, onClick: () => handleOnChange('dark') },
      {
        id: 'system',
        label: 'System',
        icon: <AutoModeIcon fontSize="small" />,
        onClick: () => handleOnChange('system'),
      },
    ].map((el) => ({
      ...el,
      menuItemProps: {
        sx: [
          mode === el.id &&
            ((theme) => ({
              color: theme.palette.primary.main,
              transition: theme.transitions.create(['color', 'background-color']),
              backgroundColor: theme.palette.background.default,
              svg: {
                color: theme.palette.primary.main,
              },
            })),
        ],
      },
    }));
  }, [mode, setMode]);

  if (!mode) return null;

  return (
    <MenuActions
      menuActions={menuActions}
      renderMenuBtn={({ handleClick }) => (
        <Button startIcon={buttonIcon} onClick={handleClick} color="inherit" size="small" variant="outlined">
          Theme
        </Button>
      )}
    />
  );
};

export default ColorModeMain;
