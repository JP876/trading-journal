import { Box, Button, useColorScheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoModeIcon from '@mui/icons-material/AutoMode';

import MenuActions from '../../MenuActions';
import { useMenuActionsContext } from '../../MenuActions/MenuActionsProvider';
import type { MenuActionsItemProps } from '../../MenuActions/types';

type ModeOptionsType = 'system' | 'light' | 'dark';

const modeIcons = {
  dark: <DarkModeIcon fontSize="small" id="dark-mode" />,
  light: <LightModeIcon fontSize="small" id="light-mode" />,
  system: <AutoModeIcon fontSize="small" id="system-mode" />,
} as const;

const MenuActionButton = ({ mode }: { mode: ModeOptionsType }) => {
  const { handleClick } = useMenuActionsContext();

  return (
    <Button
      startIcon={
        <Box
          display="flex"
          alignItems="center"
          sx={[
            { position: 'relative', mr: 2.5 },
            (theme) => ({
              svg: {
                position: 'absolute',
                opacity: 0,
                transition: theme.transitions.create(['opacity'], { duration: 500 }),
              },
              [`#${mode}-mode`]: { opacity: 1 },
            }),
          ]}
        >
          {modeIcons.light}
          {modeIcons.dark}
          {modeIcons.system}
        </Box>
      }
      onClick={handleClick}
      color="inherit"
      size="small"
      variant="outlined"
    >
      Theme
    </Button>
  );
};

const ColorModeMain = () => {
  const { mode, setMode } = useColorScheme();

  const getMenuItemProps = (value: ModeOptionsType): MenuActionsItemProps => {
    return {
      icon: modeIcons[value],
      onClick: () => setMode(value),
      label: value.charAt(0).toUpperCase() + value.slice(1),
      menuItemProps: {
        sx: [
          mode === value &&
            ((theme) => ({
              color: theme.palette.primary.main,
              transition: theme.transitions.create(['color', 'background-color']),
              backgroundColor: theme.palette.action.selected,
              svg: {
                transition: theme.transitions.create(['color']),
                color: theme.palette.primary.main,
              },
            })),
        ],
      },
    };
  };

  if (!mode) return null;

  return (
    <MenuActions renderMenuBtn={() => <MenuActionButton mode={mode} />}>
      <MenuActions.Item {...getMenuItemProps('light')} />
      <MenuActions.Item {...getMenuItemProps('dark')} />
      <MenuActions.Item {...getMenuItemProps('system')} />
    </MenuActions>
  );
};

export default ColorModeMain;
