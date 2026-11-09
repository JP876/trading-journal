import { useDebouncer } from '@tanstack/react-pacer';
import { useSetAtom, type Store } from 'jotai';

import { resetFiltersAtom, updatePageAtom } from '../atoms';

const useClearFilters = ({ wait = 400, store }: { wait?: number; store?: Store }) => {
  const resetFilters = useSetAtom(resetFiltersAtom, { store });
  const updatePage = useSetAtom(updatePageAtom, { store });

  const debouncer = useDebouncer(
    () => {
      resetFilters();
      updatePage(1);
      return null;
    },
    { wait },
    (state) => ({ isPending: state.isPending })
  );

  return [debouncer.maybeExecute, { ...debouncer.state }] as const;
};

export default useClearFilters;
