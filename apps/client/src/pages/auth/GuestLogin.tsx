import { memo } from 'react';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router';

import useSnackbar from '../../hooks/useSnackbar';
import { loginUserDB } from '../../lib/db/api/auth';

const GuestLogin = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const handleClick = async () => {
    const error = await loginUserDB();

    if (error) {
      openSnackbar({ severity: 'error', message: "We couldn't update your data. Try again or refresh." });
      return;
    }

    openSnackbar({ severity: 'success', message: `Welcome! You're in guest mode — feel free to look around.` });
    navigate('/dashboard', { replace: true });
  };

  return (
    <Button size="small" variant="outlined" startIcon={<AccountBoxIcon fontSize="small" />} onClick={handleClick}>
      Guest login
    </Button>
  );
};

export default memo(GuestLogin);
