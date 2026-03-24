import { useCallback, useMemo } from 'react';
import { useSetAtom } from 'jotai';

import { modalAtom } from '../atoms/modal';

const useModal = () => {
  const setModalInfo = useSetAtom(modalAtom);

  const openSnackbar = useCallback(
    (id: string, data: any) => {
      setModalInfo((prevState) => ({ ...prevState, [id]: { data } }));
    },
    [setModalInfo]
  );

  const closeSnackbar = useCallback(
    (id: string) => {
      setModalInfo((prevState) => {
        const modalCopy = { ...prevState };
        delete modalCopy[id];
        return modalCopy;
      });
    },
    [setModalInfo]
  );

  return useMemo(() => ({ openSnackbar, closeSnackbar }), [closeSnackbar, openSnackbar]);
};

export default useModal;
