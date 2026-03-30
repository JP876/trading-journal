import { useCallback, useState } from 'react';
import { useDebouncer } from '@tanstack/react-pacer';

import { useFiltersDispatch } from '../providers/Filters';
import { usePaginationDispatch } from '../providers/Pagination';

function useFilter<TValue = string | number | null>({ name, initialValue }: { name: string; initialValue: TValue }) {
  const filtersDispatch = useFiltersDispatch();
  const paginationDispatch = usePaginationDispatch();

  const [filterValue, setFilterValue] = useState<TValue>(initialValue);

  const debouncer = useDebouncer(
    (value) => {
      filtersDispatch({ type: 'updateFilter', value: { id: name, value } });
      paginationDispatch({ type: 'updatePage', value: 1 });
      return null;
    },
    { wait: 600 },
    (state) => ({ isPending: state.isPending })
  );

  const handleChange = useCallback((value: TValue) => {
    setFilterValue(value);
    debouncer.maybeExecute(value);
  }, []);

  return [filterValue, handleChange, { ...debouncer.state }] as const;
}

export default useFilter;
