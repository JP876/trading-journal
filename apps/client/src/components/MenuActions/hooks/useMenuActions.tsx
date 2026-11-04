import { useSetAtom } from 'jotai';
import { useMemo } from 'react';

import { anchorElAtom } from '../atoms';

const useMenuActions = () => {
  const setAnchorEl = useSetAtom(anchorElAtom);

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
