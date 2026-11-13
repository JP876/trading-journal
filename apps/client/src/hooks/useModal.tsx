import { getDefaultStore, useSetAtom } from "jotai";
import { startTransition, useCallback, useMemo } from "react";

import type { ModalInfo } from "../types";

import { closeModalAtom, openModalAtom } from "../atoms";

const useModal = () => {
  const open = useSetAtom(openModalAtom, { store: getDefaultStore() });
  const close = useSetAtom(closeModalAtom, { store: getDefaultStore() });

  const openModal = useCallback((id: string, data?: ModalInfo) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    startTransition(() => {
      open({ id, ...data });
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    startTransition(() => {
      close({ id });
    });
  }, []);

  return useMemo(() => ({ openModal, closeModal }), [closeModal, openModal]);
};

export default useModal;
