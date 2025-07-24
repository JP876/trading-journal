import { memo } from 'react';
import { Box, Button, useColorScheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoModeIcon from '@mui/icons-material/AutoMode';

import MenuActions from '@/components/MenuActions';
import { menuActionType } from '@/components/MenuActions/types';

type modeOptions = 'system' | 'light' | 'dark';

const modeIcons = {
  dark: <DarkModeIcon fontSize="small" id="dark-mode" />,
  light: <LightModeIcon fontSize="small" id="light-mode" />,
  system: <AutoModeIcon fontSize="small" id="system-mode" />,
};

const ColorModeMain = () => {
  const { mode, setMode } = useColorScheme();

  const handleOnChange = (value: modeOptions) => setMode(value);

  const menuActions: menuActionType[] = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'System' },
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
            backgroundColor: theme.palette.action.selected,
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
      )}
    />
  );
};

export default memo(ColorModeMain);
