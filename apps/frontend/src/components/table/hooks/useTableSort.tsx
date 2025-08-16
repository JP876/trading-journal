import { useCallback, useRef } from 'react';
import { useAtom } from 'jotai';

import { orderByAtom } from '../tableAtoms';

function useTableSort(): [string, (e: React.MouseEvent<unknown>, key: string) => void] {
  const prevOrderByRef = useRef('');
  const [orderBy, setOrderBy] = useAtom(orderByAtom);

  const handleOrderBy = useCallback((_: React.MouseEvent<unknown>, property: string) => {
    setOrderBy((prevValue) => {
      prevOrderByRef.current = prevValue;
      const isAsc = prevValue === property && !prevValue.startsWith('-');
      return `${isAsc ? '-' : ''}${property}`;
    });
  }, []);

  return [orderBy, handleOrderBy];
}

export default useTableSort;
