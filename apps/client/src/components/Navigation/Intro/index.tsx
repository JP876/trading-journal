import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import IntroForm from './IntroForm';

const IntroMain = () => {
  return (
    <Stack gap={2}>
      <Typography variant="body1">
        Customize a few details and we'll create sample trades for you, so you can try out the platform with a more
        complete dashboard. The trades are for demonstration only. Prefer to start with an empty account? Select Cancel.
      </Typography>
      <Divider />
      <IntroForm />
    </Stack>
  );
};

export default IntroMain;
