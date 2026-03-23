import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Box, Divider } from '@mui/material';
import type { AxiosError } from 'axios';

import { loginUser } from '../../../../api/auth';
import { useAppForm } from '../../../Form';
import { LoginFormSchema } from '../../../../types/auth';
import withCatch from '../../../../lib/withCatch';
import useSnackbar from '../../../../hooks/useSnackbar';
import type { APIError } from '../../../../types';
import { defaultMsg } from '../../../../consts';
import type { User } from '../../../../types/user';

const LoginForm = () => {
  const navigate = useNavigate({ from: '/login' });
  const mutation = useMutation({ mutationFn: loginUser });

  const { openSnackbar } = useSnackbar();

  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onSubmit: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const [err, user] = await withCatch<User, AxiosError<APIError>>(mutation.mutateAsync(value));

      if (err) {
        openSnackbar({ severity: 'error', message: err.response?.data.message || defaultMsg.error });
        return;
      }

      navigate({ to: '/dashboard' });
      setTimeout(() => {
        openSnackbar({ severity: 'success', message: `Welcome ${user.name}, you're now logged in.` });
      }, 200);
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 2 }}>
      <form.AppField name="email">{(field) => <field.TextField label="Email *" />}</form.AppField>
      <form.AppField name="password">{(field) => <field.TextField label="Password *" type="password" />}</form.AppField>
      <Divider />
      <form.AppForm>
        <form.SubscribeButton loading={mutation.isPending}>Submit</form.SubscribeButton>
      </form.AppForm>
    </Box>
  );
};

export default LoginForm;
