import { Avatar, ButtonBase } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import useAppStore from '@/store';
import { editLoggedInUserAvatar } from '@/api/user';

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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      mutation.mutate(file);
    }
  };

  return (
    <ButtonBase
      component="label"
      role={undefined}
      tabIndex={-1} // prevent label from tab focus
      aria-label="Avatar image"
      sx={{
        borderRadius: '40px',
        '&:has(:focus-visible)': {
          outline: '2px solid',
          outlineOffset: '2px',
        },
      }}
    >
      <Avatar alt="Upload new avatar" src={avatar?.path} />
      <input
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
        onChange={handleAvatarChange}
      />
    </ButtonBase>
  );
};

export default ProfileAvatarMain;
