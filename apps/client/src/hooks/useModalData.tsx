import { atom, getDefaultStore, useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { modalAtom } from '../atoms';

function useModalData<TData extends {}>(id: string) {
  const tradeDataAtom = useMemo(() => {
    return atom((get) => get(modalAtom)?.[id]?.data as undefined | TData);
  }, [id]);

  return useAtomValue(tradeDataAtom, { store: getDefaultStore() });
}

export default useModalData;
