import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useAppStore from '@/store';

const AddTradeBtn = () => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => openModal({ id: 'addTrade' })}>
      Add Trade
    </Button>
  );
};

export default AddTradeBtn;
