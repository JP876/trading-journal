import { useSetAtom, type Store } from 'jotai';
import { useMemo } from 'react';

import { dzRemoveFileAtom } from '../atoms';

const useRemoveFile = (store?: Store) => {
  const removeFile = useSetAtom(dzRemoveFileAtom, { store });

  return useMemo(() => {
    const handleRemoveFile = (id: string) => {
      removeFile(id);
    };
    return [handleRemoveFile];
  }, []);
};

export default useRemoveFile;
