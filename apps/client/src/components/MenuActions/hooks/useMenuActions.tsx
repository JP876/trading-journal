import { useSetAtom, type Store } from 'jotai';
import { useMemo } from 'react';

import { anchorElAtom } from '../atoms';

const useMenuActions = (store?: Store) => {
  const setAnchorEl = useSetAtom(anchorElAtom, { store });

  return useMemo(() => {
    return {
      handleClick: (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
      },
      handleClose: () => {
        setAnchorEl(null);
      },
    };
  }, []);
};

export default useMenuActions;
