import { memo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

const LoadingAdornment = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <InputAdornment
      position="end"
      sx={(theme) => ({
        opacity: +!!isLoading,
        transition: theme.transitions.create(['opacity']),
      })}
    >
      <CircularProgress size={24} />
    </InputAdornment>
  );
};

export default memo(LoadingAdornment);
