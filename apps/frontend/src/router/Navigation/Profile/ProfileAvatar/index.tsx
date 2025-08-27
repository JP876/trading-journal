import { Avatar, Box, ButtonBase } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PhotoIcon from '@mui/icons-material/Photo';
import { styled } from '@mui/material/styles';

import useAppStore from '@/store';
import { editLoggedInUserAvatar } from '@/api/user';

const AvatarButtonBase = styled(ButtonBase)(({ theme }) => ({
  width: '5rem',
  height: '5rem',
  borderRadius: '50%',
  img: {
    transition: theme.transitions.create(['filter']),
  },

  '&:has(:focus-visible)': {
    outline: '2px solid',
    outlineOffset: '2px',
  },

  '&:hover': {
    img: {
      filter: 'brightness(84%)',
    },
    '#photo-icon': {
      opacity: 1,
    },
  },
}));

const ProfileAvatarMain = () => {
  const avatar = useAppStore((state) => state.user?.avatar);
  const openToast = useAppStore((state) => state.openToast);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editLoggedInUserAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      openToast({ severity: 'success', message: 'Your profile picture have been saved.' });
    },
  });

  const handleOnClick = () => {
    const input = document.getElementById('avatar-file-input');
    if (input) {
      input.click();
    } else {
      console.warn('Avatar input element not found');
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      mutation.mutate(file);
    }
  };

  return (
    <AvatarButtonBase
      role={undefined}
      tabIndex={-1} // prevent label from tab focus
      aria-label="Avatar image"
      onClick={handleOnClick}
    >
      <Box sx={{ width: 'inherit', height: 'inherit' }}>
        <PhotoIcon
          id="photo-icon"
          sx={(theme) => ({
            position: 'absolute',
            zIndex: 1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: theme.palette.common.white,
            opacity: 0,
            transition: theme.transitions.create(['opacity']),
          })}
        />
        <Avatar alt="Upload new avatar" src={avatar?.path} sx={{ width: 'inherit', height: 'inherit' }} />
      </Box>
      <input id="avatar-file-input" type="file" accept="image/*" hidden onChange={handleAvatarChange} />
    </AvatarButtonBase>
  );
};

export default ProfileAvatarMain;
