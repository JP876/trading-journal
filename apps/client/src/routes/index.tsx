import { Button, Stack } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';

import getIcon from '../components/getIcon';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: '100vh', width: '100vw' }}>
      <Stack>
        <Button
          variant="outlined"
          LinkComponent={Link}
          href="login"
          startIcon={getIcon('login', { fontSize: 'small' })}
        >
          Sign Up
        </Button>
      </Stack>
    </Stack>
  );
}
