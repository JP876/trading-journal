import { createFileRoute } from '@tanstack/react-router';
import { Paper, Stack } from '@mui/material';

import RegisterForm from '../../components/loginPage/forms/Register';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: '100vw', height: '100vh' }}>
      <Paper sx={{ width: '20rem' }}>
        <RegisterForm />
      </Paper>
    </Stack>
  );
}
