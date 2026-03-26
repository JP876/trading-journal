import { forwardRef, memo } from 'react';
import Dialog, { type DialogProps } from '@mui/material/Dialog';
import DialogContent, { type DialogContentProps } from '@mui/material/DialogContent';
import DialogTitle, { type DialogTitleProps } from '@mui/material/DialogTitle';
import { IconButton, Slide, Stack, type Breakpoint } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TransitionProps } from '@mui/material/transitions';
import { useAtomValue } from 'jotai';

import useModal from '../../hooks/useModal';
import { modalAtom } from '../../atoms/modal';

type DialogMainPropsType = {
  id: string;
  title: string | React.ReactNode;
  children: React.ReactNode;
  dialogProps?: Omit<DialogProps, 'open' | 'onClose'>;
  dialogContentProps?: DialogContentProps;
  dialogTitleProps?: DialogTitleProps;
  hideCloseBtn?: boolean;
  size?: Breakpoint;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DialogMain({
  id,
  dialogProps,
  dialogContentProps,
  dialogTitleProps,
  title,
  hideCloseBtn,
  children,
  size,
}: DialogMainPropsType) {
  const modalInfo = useAtomValue(modalAtom)?.[id];
  const { closeModal } = useModal();

  const handleCloseModal = () => closeModal(id);

  return (
    <Dialog
      maxWidth={size || 'sm'}
      keepMounted={false}
      closeAfterTransition={true}
      disableRestoreFocus={true}
      slots={{ transition: Transition }}
      slotProps={{ paper: { sx: { width: '100%' } } }}
      {...dialogProps}
      open={!!modalInfo}
      disablePortal
      onClose={handleCloseModal}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <DialogTitle {...dialogTitleProps}>{title}</DialogTitle>
        {hideCloseBtn ? null : (
          <IconButton sx={{ mr: 3 }} size="small" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <DialogContent dividers {...dialogContentProps}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default memo(DialogMain);
