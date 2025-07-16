import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useAppStore from '@/store';

const AddAccountBtn = () => {
  const openModal = useAppStore((state) => state.openModal);
  return (
    <Button startIcon={<AddIcon />} size="small" variant="contained" onClick={() => openModal({ id: 'addAccount' })}>
      Add Account
    </Button>
  );
};

export default AddAccountBtn;
