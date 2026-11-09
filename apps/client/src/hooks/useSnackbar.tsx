import { getDefaultStore, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

import { closeSnackbarAtom, openSnackbarAtom } from '../atoms';
import type { SnackbarAtom } from '../types/snackbar';

const useSnackbar = () => {
  const open = useSetAtom(openSnackbarAtom, { store: getDefaultStore() });
  const close = useSetAtom(closeSnackbarAtom, { store: getDefaultStore() });

  const openSnackbar = useCallback((info: Omit<SnackbarAtom, 'open'>) => open(info), [open]);
  const closeSnackbar = useCallback(() => close(), [close]);

  return useMemo(() => ({ openSnackbar, closeSnackbar }), [closeSnackbar, openSnackbar]);
};

export default useSnackbar;
