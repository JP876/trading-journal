import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

import LoginForm from './forms/Login';

const GoogleButton = () => {
  return (
    <Button fullWidth size="small" variant="outlined" startIcon={<GoogleIcon />}>
      Google
    </Button>
  );
};

const AuthMain = () => {
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
        <Divider sx={{ span: { fontSize: '0.875rem' } }} textAlign="center">
          Or continue with
        </Divider>
        <LoginForm />
        <Stack mt={-2} direction="row" alignItems="center" justifyContent="center" gap={1}>
          <Typography sx={{ fontWeight: 'medium' }} variant="body2">
            Don&apos;t have an account?
          </Typography>
          <Button size="small">Sign Up</Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default AuthMain;
