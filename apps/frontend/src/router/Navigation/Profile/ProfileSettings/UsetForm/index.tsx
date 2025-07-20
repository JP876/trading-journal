import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Button, Divider, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { UserFormSchema, userFormSchema } from '@/types/user';
import useAppStore from '@/store';
import { editLoggedInUser } from '@/api/user';
import FormMain from '@/components/form/FormMain';
import TextInput from '@/components/form/TextInput';

const UserFormMain = () => {
  const queryClient = useQueryClient();
  const userData = useAppStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: editLoggedInUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const form = useForm<UserFormSchema>({
    resolver: standardSchemaResolver(userFormSchema),
    defaultValues: {
      userName: userData?.userName,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
    },
  });

  const onSubmit = (data: UserFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <FormMain form={form} onSubmit={onSubmit}>
      <Controller
        name="userName"
        control={form.control}
        render={({ field }) => <TextInput label="Username" field={field} />}
      />

      <Stack direction="row" alignItems="center" gap={2}>
        <Controller
          name="firstName"
          control={form.control}
          render={({ field }) => <TextInput label="First name" field={field} />}
        />
        <Controller
          name="lastName"
          control={form.control}
          render={({ field }) => <TextInput label="Last name" field={field} />}
        />
      </Stack>

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button loading={mutation.isPending} startIcon={<CheckIcon />} size="small" variant="contained" type="submit">
          Confirm
        </Button>
      </Stack>
    </FormMain>
  );
};

export default UserFormMain;
