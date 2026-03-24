import { useCallback, useMemo } from 'react';
import { useSetAtom } from 'jotai';

import { modalAtom } from '../atoms/modal';

const useModal = () => {
  const setModalInfo = useSetAtom(modalAtom);

  const openModal = useCallback(
    (id: string, data?: any) => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setTimeout(() => {
        setModalInfo((prevState) => ({ ...prevState, [id]: { data } }));
      }, 200);
    },
    [setModalInfo]
  );

  const closeModal = useCallback(
    (id: string) => {
      setModalInfo((prevState) => {
        const modalCopy = { ...prevState };
        delete modalCopy[id];
        return modalCopy;
      });
    },
    [setModalInfo]
  );

  return useMemo(() => ({ openModal, closeModal }), [closeModal, openModal]);
};

export default useModal;
