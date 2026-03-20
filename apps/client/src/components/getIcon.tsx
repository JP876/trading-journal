import type { SvgIconProps } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';

type IconVariants = 'login' | 'close' | 'check' | 'doneAll';

const getIcon = (variant: IconVariants, props?: SvgIconProps): React.ReactNode => {
  switch (variant) {
    case 'login':
      return <LoginIcon {...props} />;
    case 'check':
      return <CheckIcon {...props} />;
    case 'close':
      return <CloseIcon {...props} />;
    case 'doneAll':
      return <DoneAllIcon {...props} />;
    default:
      console.warn('Not supported icon variant');
      return null;
  }
};

export default getIcon;
