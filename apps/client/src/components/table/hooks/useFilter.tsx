import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncer } from '@tanstack/react-pacer';

import { useFiltersDispatch, useFiltersState, type FilterValue } from '../providers/Filters';
import { usePaginationDispatch } from '../providers/Pagination';

type FiltersHookProps = {
  name: string;
  initialValue: FilterValue;
  wait?: number;
};

function useFilter({ name, initialValue, wait = 600 }: FiltersHookProps) {
  const justMounted = useRef(true);

  const filtersDispatch = useFiltersDispatch();
  const paginationDispatch = usePaginationDispatch();

  const filtersValue = useFiltersState();
  const [filterValue, setFilterValue] = useState<FilterValue>(initialValue);

  const debouncer = useDebouncer(
    (value) => {
      filtersDispatch({ type: 'updateFilter', value: { id: name, value } });
      paginationDispatch({ type: 'updatePage', value: 1 });
      return null;
    },
    { wait },
    (state) => ({ isPending: state.isPending })
  );

  const handleChange = useCallback((value: FilterValue) => {
    setFilterValue(value);
    debouncer.maybeExecute(value);
  }, []);

  useEffect(() => {
    if (!justMounted.current && !filtersValue?.[name]) {
      setFilterValue(null);
    }
    justMounted.current = false;
  }, [filtersValue?.[name]]);

  return [filterValue, handleChange, { ...debouncer.state }] as const;
}

export default useFilter;
