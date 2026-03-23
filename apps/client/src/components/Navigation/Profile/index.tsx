import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';

import MenuActions from '../../MenuActions';
import { userAtom } from '../../../atoms/user';
import { useMenuActionsContext } from '../../MenuActions/MenuActionsProvider';
import withCatch from '../../../lib/withCatch';
import { logoutUser } from '../../../api/auth';
import { Route } from '../../../routes/_auth';
import useSnackbar from '../../../hooks/useSnackbar';

const MenuActionButton = () => {
  const user = useAtomValue(userAtom);
  const { handleClick } = useMenuActionsContext();

  return (
    <IconButton size="small" aria-label="settings" onClick={handleClick}>
      <Tooltip arrow disableInteractive title={user?.name}>
        {user?.image ? (
          <Avatar src={user.image} />
        ) : (
          <Avatar>
            <PersonIcon />
          </Avatar>
        )}
      </Tooltip>
    </IconButton>
  );
};

const ProfileMain = () => {
  const router = useRouter();
  const navigate = Route.useNavigate();

  const { openSnackbar } = useSnackbar();

  const handleLogout = async (_: any, handleClose: () => void) => {
    await withCatch(logoutUser());

    handleClose();
    openSnackbar({ severity: 'success', message: 'You have successfully logged out.' });

    await router.invalidate();
    navigate({ to: '/login' });
  };

  return (
    <>
      <MenuActions renderMenuBtn={() => <MenuActionButton />}>
        <MenuActions.Item label="Profile" icon={<AccountCircleIcon fontSize="small" />} onClick={() => null} />
        <MenuActions.Divider />
        <MenuActions.Item label="Logout" icon={<LogoutIcon fontSize="small" />} onClick={handleLogout} />
      </MenuActions>
    </>
  );
};

export default ProfileMain;
