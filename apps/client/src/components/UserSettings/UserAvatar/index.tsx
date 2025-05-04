import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User2 } from 'lucide-react';

import useAppStore from '@/store';
import { editLoggedInUserAvatar } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';

const UserAvatar = () => {
  const queryClient = useQueryClient();
  const userData = useAppStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: editLoggedInUserAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('The account has been updated successfully.');
    },
  });

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.warn('File not found');
      return;
    }
    mutation.mutate(file);
  };

  const handleOnClick = () => {
    const input = document.getElementById('user-avatar-input');
    if (input) input.click();
  };

  return (
    <>
      <Avatar className="size-28 hover:cursor-pointer" onClick={handleOnClick}>
        <AvatarImage src={userData?.avatar?.url} />
        <AvatarFallback>{mutation.isPending ? <Spinner /> : <User2 className="size-8" />}</AvatarFallback>
      </Avatar>
      <input
        hidden
        type="file"
        accept="image/*"
        id="user-avatar-input"
        onChange={handleOnChange}
        disabled={mutation.isPending}
      />
    </>
  );
};

export default UserAvatar;
