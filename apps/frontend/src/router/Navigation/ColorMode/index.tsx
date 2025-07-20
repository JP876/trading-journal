import { memo } from 'react';
import { Button, useColorScheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoModeIcon from '@mui/icons-material/AutoMode';

import MenuActions from '@/components/MenuActions';
import { menuActionType } from '@/components/MenuActions/types';

type modeOptions = 'system' | 'light' | 'dark';

const modeIcons = {
  dark: <DarkModeIcon fontSize="small" />,
  light: <LightModeIcon fontSize="small" />,
  system: <AutoModeIcon fontSize="small" />,
};

const ColorModeMain = () => {
  const { mode, setMode } = useColorScheme();

  const buttonIcon = (() => {
    switch (mode) {
      case 'dark':
        return modeIcons.dark;
      case 'light':
        return modeIcons.light;
      default:
        return modeIcons.system;
    }
  })();

  const handleOnChange = (value: modeOptions) => setMode(value);

  const menuActions: menuActionType[] = [
    { id: 'light', label: 'Light', icon: modeIcons.light },
    { id: 'dark', label: 'Dark', icon: modeIcons.dark },
    { id: 'system', label: 'System', icon: modeIcons.system },
  ].map((el) => ({
    ...el,
    onClick: () => handleOnChange(el.id as modeOptions),
    icon: modeIcons[el.id as modeOptions],
    menuItemProps: {
      sx: [
        mode === el.id &&
          ((theme) => ({
            color: theme.palette.primary.main,
            transition: theme.transitions.create(['color', 'background-color']),
            backgroundColor: theme.palette.background.default,
            svg: {
              transition: theme.transitions.create(['color']),
              color: theme.palette.primary.main,
            },
          })),
      ],
    },
  }));

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

export default memo(ColorModeMain);
