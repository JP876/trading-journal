import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

const NotFoundValue = () => {
  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
      <CloseIcon fontSize="small" />
    </Stack>
  );
};

export default NotFoundValue;
