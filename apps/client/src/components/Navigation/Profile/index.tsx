import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { useAtomValue } from 'jotai';

import { logoutUser } from '../../../api/auth';
import { userAtom } from '../../../atoms/user';
import useLogout from '../../../hooks/useLogout';
import useSnackbar from '../../../hooks/useSnackbar';
import withCatch from '../../../lib/withCatch';
import MenuActions from '../../MenuActions';
import { useMenuActionsContext } from '../../MenuActions/MenuActionsProvider';

const MenuActionButton = () => {
  const { handleClick } = useMenuActionsContext();
  const user = useAtomValue(userAtom);

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
  const { openSnackbar } = useSnackbar();
  const [logout] = useLogout();

  const handleLogout = async () => {
    await withCatch(logoutUser());
    openSnackbar({ severity: 'success', message: 'You have successfully logged out.' });
    logout();
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
