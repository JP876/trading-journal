import { atom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { modalAtom } from '../../../atoms';
import type { Trade } from '../../../types/trade';

const useTradeDetails = (id: string) => {
  const tradeDataAtom = useMemo(() => {
    return atom((get) => get(modalAtom)?.[id]?.data as Trade | undefined);
  }, [id]);
  return useAtomValue(tradeDataAtom);
};

export default useTradeDetails;
