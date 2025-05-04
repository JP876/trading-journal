import { memo } from 'react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useAppStore from '@/store';
import { TradeDialogListIds } from './types';

const AddTradeButton = () => {
  const openModal = useAppStore((state) => state.openModal);

  return (
    <Button size="sm" onClick={() => openModal({ id: TradeDialogListIds.ADD_TRADE })}>
      <PlusIcon /> Add Trade
    </Button>
  );
};

export default memo(AddTradeButton);
