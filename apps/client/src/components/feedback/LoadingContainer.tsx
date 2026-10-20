import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export type TLoadingContainerProps = {
  isLoading: boolean;
  children: React.ReactNode;
  unmount?: boolean;
};

const LoadingContainer = ({ isLoading, unmount, children }: TLoadingContainerProps) => {
  const renderChildren = () => {
    if (unmount) {
      return isLoading ? null : children;
    }
    return <Box sx={() => ({ width: '100%', height: '100%', display: isLoading ? 'none' : 'block' })}>{children}</Box>;
  };

  return (
    <Box sx={() => ({ width: '100%', height: '100%', display: 'flex', position: 'relative' })}>
      <Box
        sx={[
          (theme) => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            opacity: isLoading ? 1 : 0,
            transition: theme.transitions.create('opacity'),
          }),
        ]}
      >
        <CircularProgress size={56} />
      </Box>
      {renderChildren()}
    </Box>
  );
};

export default LoadingContainer;
