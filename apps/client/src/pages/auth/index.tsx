import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { lazy, useState } from 'react';

import LoginForm from './forms/Login';
import GuestLogin from './GuestLogin';

const RegisterForm = lazy(() => import('./forms/Register'));

const AuthPage = () => {
  const [show, setShow] = useState<'login' | 'register'>('login');

  const handleChangeForm = () => {
    setShow((prevValue) => (prevValue === 'login' ? 'register' : 'login'));
  };

  return (
    <Stack sx={[{ height: '100vh', justifyContent: 'center', alignItems: 'center' }]} direction="row">
      <Paper sx={{ width: '30vw', minWidth: '28rem', p: 4, gap: 4, display: 'flex', flexDirection: 'column' }}>
        <Stack sx={[{ alignItems: 'center' }]}>
          <Typography variant="h5" sx={[(theme) => ({ fontWeight: theme.typography.fontWeightBold })]}>
            Welcome back
          </Typography>
        </Stack>

        <Box sx={() => ({ display: 'grid', gridTemplateColumns: '1fr', gap: 2 })}>
          <GuestLogin />
          {/* <GoogleButton /> */}
        </Box>

        {show === 'login' ? (
          <>
            <Divider sx={{ span: { fontSize: '0.875rem' } }} textAlign="center">
              Or continue with
            </Divider>
            <LoginForm />
            <Stack
              direction="row"
              spacing={1}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBlockStart: theme.spacing(-2),
                }),
              ]}
            >
              <Typography sx={{ fontWeight: 'medium' }} variant="body2">
                Don&apos;t have an account?
              </Typography>
              <Button size="small" disableRipple variant="text" onClick={handleChangeForm}>
                Sign Up
              </Button>
            </Stack>
          </>
        ) : (
          <>
            <Divider sx={{ span: { fontSize: '0.875rem' } }} textAlign="center">
              Or with username, email and password
            </Divider>
            <RegisterForm />
            <Stack
              direction="row"
              spacing={1}
              sx={[
                (theme) => ({
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBlockStart: theme.spacing(-2),
                }),
              ]}
            >
              <Typography sx={{ fontWeight: 'medium' }} variant="body2">
                Have an account?
              </Typography>
              <Button disableRipple size="small" onClick={handleChangeForm}>
                Log in
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Stack>
  );
};

export default AuthPage;
