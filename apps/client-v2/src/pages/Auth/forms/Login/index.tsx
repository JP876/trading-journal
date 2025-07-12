import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Box, Button, Divider, TextField } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { AxiosError } from 'axios';

import { ErrorResponse } from '@/types';
import { loginUser } from '@/api/auth';
import { loginFormSchema, LoginFormType } from '@/types/auth';

const LoginForm = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate('/trades', { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data.message;
      if (message) {
      }
    },
  });

  const form = useForm<LoginFormType>({
    resolver: standardSchemaResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormType) => {
    mutation.mutate(data);
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => <TextField label="Email" size="small" type="email" {...field} />}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field }) => <TextField label="Password" size="small" type="password" {...field} />}
      />
      <Divider />
      <Button loading={mutation.isPending} startIcon={<LoginIcon />} size="small" variant="contained" type="submit">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
