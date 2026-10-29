import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { getLoggedInUser, logoutUser } from '../../../api/auth';
import { userAtom } from '../../../atoms/user';
import { QueryKey } from '../../../enums';
import useLogout from '../../../hooks/useLogout';
import useSnackbar from '../../../hooks/useSnackbar';
import withCatch from '../../../lib/withCatch';
import MenuActions from '../../MenuActions';
import { useMenuActionsContext } from '../../MenuActions/MenuActionsProvider';

const MenuActionButton = () => {
  const { handleClick } = useMenuActionsContext();
  const setUser = useSetAtom(userAtom);

  const { data } = useQuery({
    queryKey: [QueryKey.USER],
    queryFn: getLoggedInUser,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  return (
    <IconButton size="small" aria-label="settings" onClick={handleClick}>
      <Tooltip arrow disableInteractive title={data?.name}>
        {data?.image ? (
          <Avatar src={data.image} />
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

  const handleLogout = async (_: any, handleClose: () => void) => {
    await withCatch(logoutUser());
    handleClose();

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
