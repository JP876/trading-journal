import { Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import DialogMain from '@/components/DialogMain';
import { AccountType } from '@/types/accounts';
import { deleteAccount } from '@/api/accounts';

type DeleteAccountDialogProps = {
  account: AccountType;
  closeModal: () => void;
};

const DeleteAccountDialog = ({ account, closeModal }: DeleteAccountDialogProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      closeModal();
    },
  });

  const handleDeleteTrade = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (account?._id) {
      mutation.mutate(account?._id);
    } else {
      console.warn('Account ID not found');
    }
  };

  return (
    <DialogMain
      id="deleteAccount"
      title="Are you absolutely sure?"
      hideCloseBtn
      dialogContentProps={{ dividers: false }}
    >
      <Stack mt={-2} gap={2}>
        <Typography>
          This action cannot be undone. This will permanently delete account and trades that are added to that account.
        </Typography>
        <Stack direction="row" alignItems="center" gap={2} justifyContent="flex-end">
          <Button
            disabled={mutation.isPending}
            color="inherit"
            startIcon={<ClearIcon />}
            size="small"
            variant="outlined"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            loading={mutation.isPending}
            startIcon={<DeleteIcon />}
            size="small"
            variant="contained"
            color="error"
            onClick={handleDeleteTrade}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </DialogMain>
  );
};

export default DeleteAccountDialog;
