import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import ConfirmDialog, { onClickEvent } from '@/components/ConfirmDialog';
import useAppStore from '@/store';
import { deleteTrade } from '@/api/trades';
import { TradeDialogListIds } from '../types';

const DeleteTrade = () => {
  const modalInfo = useAppStore((state) => state.modalInfo);
  const closeModal = useAppStore((state) => state.closeModal);

  const handleCloseModal = () => {
    closeModal(TradeDialogListIds.DELETE_TRADE);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      handleCloseModal();
      toast.success('The trade has been deleted successfully.');
    },
  });

  const handleDeleteTrade = (e: onClickEvent) => {
    e.preventDefault();
    mutation.mutate(modalInfo?.[TradeDialogListIds.DELETE_TRADE]?.data?._id);
  };

  return (
    <ConfirmDialog
      open={!!modalInfo?.[TradeDialogListIds.DELETE_TRADE]}
      onOpenChange={handleCloseModal}
      description="This action cannot be undone. This will permanently delete trade."
      confirmButtonProps={{ onClick: handleDeleteTrade, label: 'Delete' }}
    />
  );
};

export default DeleteTrade;
