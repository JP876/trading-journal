import React, { memo } from 'react';

import useAppStore from '@/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type DialogMainProps = {
  id: string;
  title: string;
  size?: 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
};

const DialogMain = ({ size = '2xl', ...props }: DialogMainProps) => {
  const modalInfo = useAppStore((state) => state.modalInfo);
  const closeModal = useAppStore((state) => state.closeModal);

  return (
    <Dialog modal open={!!modalInfo?.[props.id]} onOpenChange={() => closeModal(props.id)}>
      <DialogContent className={`sm:max-w-3xl`}>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription className="sr-only">Description</DialogDescription>
        </DialogHeader>

        {props.children}
      </DialogContent>
    </Dialog>
  );
};

export default memo(DialogMain);
