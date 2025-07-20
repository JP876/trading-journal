import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar, Tooltip } from '@mui/material';

import useAppStore from '@/store';
import MenuActions from '@/components/MenuActions';
import { logoutUser } from '@/api/auth';
import { menuActionType } from '@/components/MenuActions/types';
import DialogMain from '@/components/DialogMain';
import ProfileSettings from './ProfileSettings';
import { memo } from 'react';

const ProfileModalList = () => {
  return (
    <>
      <DialogMain id="profileSettings" title="Profile" dialogProps={{ maxWidth: 'sm' }}>
        <ProfileSettings />
      </DialogMain>
    </>
  );
};

const ProfileMain = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate('/auth');
    },
  });

  const userName = useAppStore((state) => state.user?.userName);
  const avatar = useAppStore((state) => state.user?.avatar);

  const openModal = useAppStore((state) => state.openModal);

  const menuActions = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <AccountCircleIcon fontSize="small" />,
      onClick: (_, handleClose) => {
        openModal({ id: 'profileSettings' });
        handleClose();
      },
    },
    { id: 'divider' },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogoutIcon fontSize="small" />,
      onClick: () => mutation.mutate(),
      isLoading: mutation.isPending,
    },
  ] as menuActionType[];

  return (
    <>
      <MenuActions menuActions={menuActions}>
        <Tooltip arrow disableInteractive title={userName}>
          {avatar?.url ? (
            <Avatar src={avatar?.url} />
          ) : (
            <Avatar>
              <PersonIcon />
            </Avatar>
          )}
        </Tooltip>
      </MenuActions>

      <ProfileModalList />
    </>
  );
};

export default memo(ProfileMain);
