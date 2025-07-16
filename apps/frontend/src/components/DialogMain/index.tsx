import { forwardRef, memo, ReactNode } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogTitle, { DialogTitleProps } from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { IconButton, Slide, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import useAppStore from '@/store';

type dialogMainPropsType<T = any> = {
  id: string;
  title: string | ReactNode;
  children: ReactNode | ((options: { data: T; handleCloseModal: () => void }) => ReactNode);
  dialogProps?: Omit<DialogProps, 'open' | 'onClose'>;
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

function DialogMain<T>(props: dialogMainPropsType<T>) {
  const modalInfo = useAppStore((state) => state.modalInfo?.[props.id]);
  const closeModal = useAppStore((state) => state.closeModal);

  const handleCloseModal = () => closeModal(props.id);

  return (
    <Dialog
      maxWidth="sm"
      keepMounted={false}
      slots={{ transition: Transition }}
      slotProps={{ paper: { sx: { width: '100%' } } }}
      {...props?.dialogProps}
      open={!!modalInfo}
      onClose={handleCloseModal}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <DialogTitle {...props?.dialogTitleProps}>{props.title}</DialogTitle>
        {props?.hideCloseBtn ? null : (
          <IconButton sx={{ mr: 3 }} size="small" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <DialogContent dividers {...props?.dialogContentProps}>
        {typeof props.children === 'function'
          ? props.children({ data: modalInfo?.data, handleCloseModal })
          : props.children}
      </DialogContent>
    </Dialog>
  );
}

export default memo(DialogMain);
