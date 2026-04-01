import { useState } from 'react';
import InputAdornment, { type InputAdornmentProps } from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';

import type { TextInputProps } from '../TextInput';
import TextInput from '../TextInput';

const PasswordEndAdornment = styled(InputAdornment, {
  shouldForwardProp: (props) => props !== 'showPassword',
})<InputAdornmentProps<'div', { showPassword: boolean }>>(({ theme, showPassword }) => ({
  position: 'relative',
  '& button': {
    right: '14px',
    position: 'absolute',
  },
  '& svg': {
    position: 'absolute',
    transition: theme.transitions.create(['opacity']),
  },
  '#visibilityOff': { opacity: +!!showPassword },
  '#visibility': { opacity: +!showPassword },
}));

type PasswordInputProps = {} & TextInputProps;

const PasswordInput = ({ field, fieldState, formState, label, helperText, inputProps }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextInput
      field={field}
      fieldState={fieldState}
      formState={formState}
      label={label}
      helperText={helperText}
      type={showPassword ? 'text' : 'password'}
      inputProps={{
        ...(inputProps || {}),
        slotProps: {
          ...(inputProps?.slotProps || {}),
          input: {
            ...(inputProps?.slotProps?.input || {}),
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <PasswordEndAdornment position="end" showPassword={showPassword}>
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClick}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  <VisibilityOff id="visibilityOff" fontSize="small" />
                  <Visibility id="visibility" fontSize="small" />
                </IconButton>
              </PasswordEndAdornment>
            ),
          },
        },
      }}
    />
  );
};

export default PasswordInput;
