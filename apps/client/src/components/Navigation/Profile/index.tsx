import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import MenuActions from '../../MenuActions';
import { useMenuActionsContext } from '../../MenuActions/MenuActionsProvider';
import withCatch from '../../../lib/withCatch';
import { getLoggedInUser, logoutUser } from '../../../api/auth';
import useSnackbar from '../../../hooks/useSnackbar';
import { QueryKey } from '../../../enums';

const MenuActionButton = () => {
  const { handleClick } = useMenuActionsContext();

  const { data } = useQuery({
    queryKey: [QueryKey.USER],
    queryFn: getLoggedInUser,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

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
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const handleLogout = async (_: any, handleClose: () => void) => {
    await withCatch(logoutUser());
    handleClose();

    openSnackbar({ severity: 'success', message: 'You have successfully logged out.' });
    navigate('/auth', { replace: true, viewTransition: true });
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
