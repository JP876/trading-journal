import { memo, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router';

import { db, getCurrentUser, type UserDB } from '../../lib/db';
import useSnackbar from '../../hooks/useSnackbar';
import withCatch from '../../lib/withCatch';

const GuestLogin = () => {
  const [user, setUser] = useState<UserDB | null>(null);
  const navigate = useNavigate();

  const { openSnackbar } = useSnackbar();

  const handleClick = async () => {
    if (user?.id) {
      const [error] = await withCatch(db.users.update(user.id, { isLoggedIn: true }));
      if (error) {
        openSnackbar({ severity: 'error', message: "We couldn't update your data. Try again or refresh." });
        return;
      }
    } else {
      const [error] = await withCatch(
        db.users.add({ id: crypto.randomUUID(), name: '', image: null, isLoggedIn: true })
      );
      if (error) {
        openSnackbar({ severity: 'error', message: "We couldn't create the user. Try again or refresh." });
        return;
      }
    }

    openSnackbar({ severity: 'success', message: `Welcome! You're in guest mode — feel free to look around.` });
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setUser(user);
    })();
  }, []);

  return (
    <Button size="small" variant="outlined" startIcon={<AccountBoxIcon fontSize="small" />} onClick={handleClick}>
      Guest login
    </Button>
  );
};

export default memo(GuestLogin);
