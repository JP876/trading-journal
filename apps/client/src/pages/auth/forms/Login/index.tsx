import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import EmailIcon from '@mui/icons-material/Email';
import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';

import { loginUser } from '../../../../api/auth';
import FormMain from '../../../../components/form/FormMain';
import PasswordInput from '../../../../components/form/PasswordInput';
import TextInput from '../../../../components/form/TextInput';
import { defaultMsg } from '../../../../consts';
import useSnackbar from '../../../../hooks/useSnackbar';
import type { APIError } from '../../../../types';
import { LoginFormSchema, type LoginFormData } from '../../../../types/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: loginUser,
    onError: (error: AxiosError<APIError>) => {
      openSnackbar({ severity: 'error', message: error.response?.data.message || defaultMsg.error });
    },
    onSuccess: (user) => {
      navigate(location.state?.prevLocation || '/trades', {
        replace: true,
        viewTransition: true,
        state: null,
      });
      setTimeout(() => {
        openSnackbar({ severity: 'success', message: `Welcome ${user.name}, you're now logged in.` });
      }, 200);
    },
  });

  const { openSnackbar } = useSnackbar();

  const form = useForm<LoginFormData>({
    resolver: standardSchemaResolver(LoginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <FormMain form={form} onSubmit={mutation.mutate}>
      <Controller
        name="email"
        control={form.control}
        render={(props) => (
          <TextInput
            label="Email *"
            type="email"
            inputProps={{
              slotProps: {
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              },
            }}
            {...props}
          />
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={(props) => <PasswordInput label="Password *" {...props} />}
      />
      <Button loading={mutation.isPending} startIcon={<LoginIcon />} size="small" variant="contained" type="submit">
        Login
      </Button>
    </FormMain>
  );
};

export default LoginForm;
