import { getDefaultStore, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

import { closeModalAtom, openModalAtom } from '../atoms';

const useModal = () => {
  const open = useSetAtom(openModalAtom, { store: getDefaultStore() });
  const close = useSetAtom(closeModalAtom, { store: getDefaultStore() });

  const openModal = useCallback((id: string, data?: any) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    open({ id, data });
  }, []);

  const closeModal = useCallback((id: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    close({ id });
  }, []);

  return useMemo(() => ({ openModal, closeModal }), [closeModal, openModal]);
};

export default useModal;
