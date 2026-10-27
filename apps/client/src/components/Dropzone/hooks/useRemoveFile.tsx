import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { dzRemoveFileAtom } from '../atoms';

const useRemoveFile = () => {
  const removeFile = useSetAtom(dzRemoveFileAtom);

  const handleRemoveFile = useCallback((id: string) => {
    removeFile(id);
  }, []);

  return [handleRemoveFile];
};

export default useRemoveFile;
