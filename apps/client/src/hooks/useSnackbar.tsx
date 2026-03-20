import { useCallback, useMemo } from 'react';
import { useSetAtom } from 'jotai';

import { snackbarAtom } from '../atoms/snackbar';
import type { SnackbarAtom } from '../types/snackbar';

const useSnackbar = () => {
  const setSnackbarInfo = useSetAtom(snackbarAtom);

  const openSnackbar = useCallback(
    (info: Omit<SnackbarAtom, 'open'>) => {
      setSnackbarInfo((prevState) => ({ ...prevState, ...info, open: true }));
    },
    [setSnackbarInfo]
  );

  const closeSnackbar = useCallback(() => {
    setSnackbarInfo((prevState) => ({ ...prevState, open: false }));
  }, [setSnackbarInfo]);

  return useMemo(() => ({ openSnackbar, closeSnackbar }), [closeSnackbar, openSnackbar]);
};

export default useSnackbar;
