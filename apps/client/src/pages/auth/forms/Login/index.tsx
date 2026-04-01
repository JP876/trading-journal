import { useMutation } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import type { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { loginUser } from '../../../../api/auth';
import useSnackbar from '../../../../hooks/useSnackbar';
import { LoginFormSchema, type LoginFormData } from '../../../../types/auth';
import withCatch from '../../../../lib/withCatch';
import type { User } from '../../../../types/user';
import type { APIError } from '../../../../types';
import { defaultMsg } from '../../../../consts';
import TextInput from '../../../../components/form/TextInput';
import FormMain from '../../../../components/form/FormMain';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({ mutationFn: loginUser });

  const { openSnackbar } = useSnackbar();
  console.log(location.state);

  const form = useForm<LoginFormData>({
    resolver: standardSchemaResolver(LoginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    const [err, user] = await withCatch<User, AxiosError<APIError>>(mutation.mutateAsync(data));

    if (err) {
      openSnackbar({ severity: 'error', message: err.response?.data.message || defaultMsg.error });
      return;
    }

    navigate(location.state?.prevLocation || '/trades', {
      replace: true,
      viewTransition: true,
      state: null,
    });
    setTimeout(() => {
      openSnackbar({ severity: 'success', message: `Welcome ${user.name}, you're now logged in.` });
    }, 200);
  };

  return (
    <FormMain form={form} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={form.control}
        render={(props) => <TextInput label="Email" type="email" {...props} />}
      />
      <Controller
        name="password"
        control={form.control}
        render={(props) => <TextInput label="Password" type="password" {...props} />}
      />
      <Button loading={mutation.isPending} startIcon={<LoginIcon />} size="small" variant="contained" type="submit">
        Login
      </Button>
    </FormMain>
  );
};

export default LoginForm;
