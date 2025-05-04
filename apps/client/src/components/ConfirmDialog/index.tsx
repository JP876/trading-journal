import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { CircleX, Trash } from 'lucide-react';

interface ICancelButtonProps extends React.ComponentProps<typeof AlertDialogPrimitive.Cancel> {
  label?: string;
}

export type onClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface IConfirmButtonProps extends React.ComponentProps<typeof AlertDialogPrimitive.Action> {
  label?: string;
  onClick: (e: onClickEvent) => void;
}

interface IConfirmDialog {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertDialogRootProps?: React.ComponentProps<typeof AlertDialogPrimitive.Root>;
  title?: string;
  description: string;
  cancelButtonProps?: ICancelButtonProps;
  confirmButtonProps: IConfirmButtonProps;
}

const ConfirmDialog = (props: IConfirmDialog) => {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange} {...props.alertDialogRootProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props?.title || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel {...props.cancelButtonProps}>
            <CircleX /> {props?.cancelButtonProps?.label || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction {...props.confirmButtonProps}>
            <Trash /> {props.confirmButtonProps?.label || 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
