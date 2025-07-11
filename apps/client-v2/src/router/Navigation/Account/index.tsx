import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

import useAppStore from '@/store';
import { Avatar, Tooltip } from '@mui/material';
import MenuActions from '@/components/MenuActions';
import { logoutUser } from '@/api/auth';
import { menuActionType } from '@/components/MenuActions/types';

const AccountMain = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigate('/auth');
    },
  });

  const userName = useAppStore((state) => state.user?.userName);
  const avatar = useAppStore((state) => state.user?.avatar);

  const menuActions = [
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogoutIcon fontSize="small" />,
      onClick: () => mutation.mutate(),
      isLoading: mutation.isPending,
    },
  ] as menuActionType[];

  return (
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
  );
};

export default AccountMain;
