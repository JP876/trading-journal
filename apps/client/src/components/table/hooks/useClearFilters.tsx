import { useDebouncer } from '@tanstack/react-pacer';

import { useFiltersDispatch } from '../providers/Filters';
import { usePaginationDispatch } from '../providers/Pagination';

const useClearFilters = ({ wait = 400 }: { wait?: number }) => {
  const filtersDispatch = useFiltersDispatch();
  const paginationDispatch = usePaginationDispatch();

  const debouncer = useDebouncer(
    () => {
      filtersDispatch({ type: 'resetFilters' });
      paginationDispatch({ type: 'updatePage', value: 1 });
      return null;
    },
    { wait },
    (state) => ({ isPending: state.isPending })
  );

  return [debouncer.maybeExecute, { ...debouncer.state }] as const;
};

export default useClearFilters;
