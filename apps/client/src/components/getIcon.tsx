import type { SvgIconProps } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotesIcon from '@mui/icons-material/Notes';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type IconVariants =
  | 'login'
  | 'close'
  | 'check'
  | 'doneAll'
  | 'menu'
  | 'chevronLeft'
  | 'chevronRight'
  | 'dashboard'
  | 'notes'
  | 'appRegistration'
  | 'candlestick'
  | 'moreVert';

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
    case 'appRegistration':
      return <AppRegistrationIcon {...props} />;
    case 'candlestick':
      return <CandlestickChartIcon {...props} />;
    case 'chevronLeft':
      return <ChevronLeftIcon {...props} />;
    case 'chevronRight':
      return <ChevronRightIcon {...props} />;
    case 'dashboard':
      return <DashboardIcon {...props} />;
    case 'menu':
      return <MenuIcon {...props} />;
    case 'notes':
      return <NotesIcon {...props} />;
    case 'moreVert':
      return <MoreVertIcon {...props} />;
    default:
      console.warn('Not supported icon variant');
      return null;
  }
};

export default getIcon;
