import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

import LoginForm from './forms/Login';
import { useState } from 'react';
import RegisterForm from './forms/Register';

const GoogleButton = () => {
  return (
    <Button fullWidth size="small" variant="outlined" startIcon={<GoogleIcon />}>
      Google
    </Button>
  );
};

const AuthMain = () => {
  const [show, setShow] = useState<'login' | 'register'>('login');

  const handleChangeForm = () => {
    setShow((prevValue) => (prevValue === 'login' ? 'register' : 'login'));
  };

  return (
    <Stack sx={{ height: '100%' }} direction="row" alignItems="center" justifyContent="center">
      <Paper sx={{ width: '30vw', minWidth: '28rem', p: 4, gap: 4, display: 'flex', flexDirection: 'column' }}>
        <Stack gap={1} alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Welcome back
          </Typography>
          <Typography variant="body2">Login with your Google account</Typography>
        </Stack>

        <GoogleButton />

        {show === 'login' ? (
          <>
            <Divider sx={{ span: { fontSize: '0.875rem' } }} textAlign="center">
              Or continue with
            </Divider>
            <LoginForm />
            <Stack mt={-2} direction="row" alignItems="center" justifyContent="center" gap={1}>
              <Typography sx={{ fontWeight: 'medium' }} variant="body2">
                Don&apos;t have an account?
              </Typography>
              <Button size="small" onClick={handleChangeForm}>
                Sign Up
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Divider sx={{ span: { fontSize: '0.875rem' } }} textAlign="center">
              Or with email and password
            </Divider>
            <RegisterForm />
            <Stack mt={-2} direction="row" alignItems="center" justifyContent="center" gap={1}>
              <Typography sx={{ fontWeight: 'medium' }} variant="body2">
                Have an account?
              </Typography>
              <Button size="small" onClick={handleChangeForm}>
                Log in
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Stack>
  );
};

export default AuthMain;
