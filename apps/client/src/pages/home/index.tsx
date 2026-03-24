import { Button, Stack, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router';

const HomeMain = () => {
  const navigate = useNavigate();

  return (
    <Stack sx={{ height: '100vh' }} direction="row" alignItems="center" justifyContent="center">
      <Stack gap={2} justifyContent="center" alignItems="center">
        <Typography variant="h4">Trading Journal</Typography>
        <Button startIcon={<LoginIcon />} variant="contained" onClick={() => navigate('/auth')}>
          Login/Sign Up
        </Button>
      </Stack>
    </Stack>
  );
};

export default HomeMain;
