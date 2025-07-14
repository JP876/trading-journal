import { forwardRef, ReactNode } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogTitle, { DialogTitleProps } from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { IconButton, Slide, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import useAppStore from '@/store';

type dialogMainPropsType = {
  id: string;
  title: string | ReactNode;
  children: ReactNode;
  dialogProps?: DialogProps;
  dialogContentProps?: DialogContentProps;
  dialogTitleProps?: DialogTitleProps;
  hideCloseBtn?: boolean;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogMain = (props: dialogMainPropsType) => {
  const modalInfo = useAppStore((state) => state.modalInfo);
  const closeModal = useAppStore((state) => state.closeModal);

  return (
    <Dialog
      maxWidth="sm"
      keepMounted={false}
      slots={{ transition: Transition }}
      {...props?.dialogProps}
      open={!!modalInfo?.[props.id]}
      onClose={() => closeModal(props.id)}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <DialogTitle {...props?.dialogTitleProps}>{props.title}</DialogTitle>
        {props?.hideCloseBtn ? null : (
          <IconButton sx={{ mr: 3 }} size="small" onClick={() => closeModal(props.id)}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <DialogContent dividers {...props?.dialogContentProps}>
        {props.children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogMain;
