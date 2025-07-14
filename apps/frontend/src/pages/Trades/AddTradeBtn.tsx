import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useAppStore from '@/store';

const AddTradeBtn = () => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <Tooltip arrow title="Add Trade" disableInteractive>
      <IconButton size="small" onClick={() => openModal({ id: 'addTrade' })}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
};

export default AddTradeBtn;
