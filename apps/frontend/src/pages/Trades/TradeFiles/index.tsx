import { useEffect } from 'react';
import { format } from 'date-fns';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { atom, Provider, useAtomValue, useSetAtom } from 'jotai';

import { FilesType, TradeType } from '@/types/trades';

type TradeFileProps = {
  trade: TradeType;
  closeModal: () => void;
};

const selectedPicture = atom<FilesType | null>(null);

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

const NextPictureButton = ({ files }: { files: FilesType[] }) => {
  const setSelected = useSetAtom(selectedPicture);

  const handleNextPicture = () => {
    setSelected((prevValue) => {
      const index = files.findIndex((f) => f._id === prevValue?._id);
      return index === -1 || index + 1 === files.length ? files[0] : files[index + 1];
    });
  };

  return (
    <IconButton size="large" onClick={handleNextPicture}>
      <ArrowForwardIosIcon sx={(theme) => ({ color: theme.palette.common.white })} />
    </IconButton>
  );
};

const PreviousPictureButton = ({ files }: { files: FilesType[] }) => {
  const setSelected = useSetAtom(selectedPicture);

  const handlePreviousPicture = () => {
    setSelected((prevValue) => {
      const index = files.findIndex((f) => f._id === prevValue?._id);
      if (index === -1) return files[0];
      return index === 0 ? files[files.length - 1] : files[index - 1];
    });
  };

  return (
    <IconButton size="large" onClick={handlePreviousPicture}>
      <ArrowBackIosNewIcon sx={(theme) => ({ color: theme.palette.common.white })} />
    </IconButton>
  );
};

const SelectedImageContainer = () => {
  const selected = useAtomValue(selectedPicture);

  if (!selected?.path) return null;

  return (
    <Box
      sx={() => ({
        height: '100%',
        width: '100%',
        backgroundImage: `url("${selected?.path}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      })}
    />
  );
};

const TradeFilesMain = ({ trade, closeModal }: TradeFileProps) => {
  const setSelected = useSetAtom(selectedPicture);

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
        <IconButton size="large" onClick={closeModal}>
          <CloseIcon sx={(theme) => ({ color: theme.palette.common.white })} />
        </IconButton>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={() => ({ height: 'calc(100% - 64px)', py: 6, px: 6 })}
        gap={6}
      >
        <PreviousPictureButton files={trade.files} />
        <SelectedImageContainer />
        <NextPictureButton files={trade.files} />
      </Stack>
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

export default TradeFiles;
