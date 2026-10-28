import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { dropzoneStore, dzRemoveFileAtom } from '../atoms';

const useRemoveFile = () => {
  const removeFile = useSetAtom(dzRemoveFileAtom, { store: dropzoneStore });

  const handleRemoveFile = useCallback((id: string) => {
    removeFile(id);
  }, []);

  return [handleRemoveFile];
};

export default useRemoveFile;
