import { memo, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { Box, BoxProps, Button, IconButton, Stack, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CircleIcon from '@mui/icons-material/Circle';
import { atom, Provider, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { FilesType, TradeType } from '@/types/trades';
import useKeyPress from '@/hooks/useKeyPress';

type TradeFileProps = {
  trade: TradeType;
  closeModal: () => void;
};

const selectedPictureAtom = atom<FilesType | null>(null);
const fullScreenAtom = atom<boolean>(false);

interface SelectedImageProps extends BoxProps {
  path: string;
  fullScreen: boolean;
}

const SelectedImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'path' && prop !== 'fullScreen',
})<SelectedImageProps>(({ path, fullScreen }) => ({
  cursor: 'zoom-in',
  height: '100%',
  width: '100%',
  backgroundImage: `url("${path}")`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  ...(fullScreen && {
    top: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'black',
    cursor: 'zoom-out',
  }),
}));

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

const NextPictureButton = ({ files }: { files: FilesType[] }) => {
  const setSelected = useSetAtom(selectedPictureAtom);

  const handleNextPicture = useCallback(() => {
    setSelected((prevValue) => {
      const index = files.findIndex((f) => f._id === prevValue?._id);
      return index === -1 || index + 1 === files.length ? files[0] : files[index + 1];
    });
  }, []);

  useKeyPress('ArrowRight', handleNextPicture);

  return (
    <Button size="large" onClick={handleNextPicture} disableRipple sx={[() => ({ height: '100%', zIndex: 1 })]}>
      <ArrowForwardIosIcon sx={(theme) => ({ color: theme.palette.common.white })} />
    </Button>
  );
};

const PreviousPictureButton = ({ files }: { files: FilesType[] }) => {
  const setSelected = useSetAtom(selectedPictureAtom);

  const handlePreviousPicture = useCallback(() => {
    setSelected((prevValue) => {
      const index = files.findIndex((f) => f._id === prevValue?._id);
      if (index === -1) return files[0];
      return index === 0 ? files[files.length - 1] : files[index - 1];
    });
  }, []);

  useKeyPress('ArrowLeft', handlePreviousPicture);

  return (
    <Button size="large" onClick={handlePreviousPicture} disableRipple sx={[() => ({ height: '100%', zIndex: 1 })]}>
      <ArrowBackIosNewIcon sx={(theme) => ({ color: theme.palette.common.white })} />
    </Button>
  );
};

const SelectedImageContainer = () => {
  const selected = useAtomValue(selectedPictureAtom);
  const [fullScreen, setFullScreen] = useAtom(fullScreenAtom);

  if (!selected?.path) return null;

  return (
    <SelectedImage
      onClick={() => setFullScreen((prevValue) => !prevValue)}
      path={selected.path}
      fullScreen={fullScreen}
    />
  );
};

const NavigationDot = memo(({ file, isSelected }: { file: FilesType; isSelected: boolean }) => {
  const setSelected = useSetAtom(selectedPictureAtom);

  return (
    <IconButton
      size="small"
      onClick={() => setSelected(file)}
      disableRipple
      sx={[
        (theme) => ({
          '& svg': {
            color: isSelected ? theme.palette.primary.main : theme.palette.common.white,
            transition: theme.transitions.create(['color']),
            width: theme.spacing(2.5),
            height: theme.spacing(2.5),
          },
        }),
      ]}
    >
      <CircleIcon />
    </IconButton>
  );
});

const NavigationDotsContainer = ({ files }: { files: FilesType[] }) => {
  const selected = useAtomValue(selectedPictureAtom);

  return (
    <Stack direction="row" alignItems="center" gap={4} py={2}>
      {(files || []).map((file) => (
        <NavigationDot key={file._id} file={file} isSelected={selected?._id === file._id} />
      ))}
    </Stack>
  );
};

const TradeFilesMain = ({ trade, closeModal }: TradeFileProps) => {
  const setSelected = useSetAtom(selectedPictureAtom);
  const setFullScreen = useSetAtom(fullScreenAtom);

  const handleCloseModal = () => {
    setSelected(null);
    setFullScreen(false);
    closeModal();
  };

  useKeyPress('Escape', handleCloseModal);

  useEffect(() => {
    if (Array.isArray(trade?.files) && trade?.files.length !== 0) {
      setSelected(trade.files[0]);
    }
  }, [trade?.files]);

  if (!trade?.id || !Array.isArray(trade?.files)) return null;

  return (
    <Box sx={[{ width: '100%', height: '100%' }]}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={(theme) => ({
          height: '64px',
          px: 6,
          backgroundColor: theme.palette.primary.main,
          boxShadow: theme.shadows[1],
        })}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography variant="h6">{trade.pair}</Typography>
          <Typography variant="body2" sx={{ lineHeight: 0 }}>
            {formatDate(trade.openDate)} - {formatDate(trade.closeDate)}
          </Typography>
        </Stack>
        <IconButton size="large" onClick={handleCloseModal}>
          <CloseIcon sx={(theme) => ({ color: theme.palette.common.white, zIndex: 1 })} />
        </IconButton>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={() => ({ height: 'calc(100% - 64px - 66px)', pt: 4, px: 6 })}
        gap={6}
      >
        <PreviousPictureButton files={trade.files} />
        <SelectedImageContainer />
        <NextPictureButton files={trade.files} />
      </Stack>

      {Array.isArray(trade?.files) && trade?.files?.length > 1 ? (
        <Stack direction="row" alignItems="center" justifyContent="center">
          <NavigationDotsContainer files={trade?.files} />
        </Stack>
      ) : null}
    </Box>
  );
};

const TradeFiles = (props: TradeFileProps) => {
  return (
    <Provider>
      <TradeFilesMain {...props} />
    </Provider>
  );
};

export default memo(TradeFiles);
