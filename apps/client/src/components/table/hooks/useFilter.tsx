import { useDebouncer } from '@tanstack/react-pacer';
import { useAtomValue, useSetAtom, type Store } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { tableFiltersAtom, updateFiltersAtom, updatePageAtom, type TFilterValue } from '../atoms';

type FiltersHookProps = {
  name: string;
  initialValue: TFilterValue;
  store?: Store;
  wait?: number;
};

function useFilter({ name, initialValue, store, wait = 600 }: FiltersHookProps) {
  const justMounted = useRef(true);

  const updateTableFilters = useSetAtom(updateFiltersAtom, { store });
  const updatePage = useSetAtom(updatePageAtom, { store });

  const filtersValue = useAtomValue(tableFiltersAtom);
  const [filterValue, setFilterValue] = useState<TFilterValue>(initialValue);

  const debouncer = useDebouncer(
    (value) => {
      updateTableFilters({ [name]: value });
      updatePage(1);
      return null;
    },
    { wait },
    (state) => ({ isPending: state.isPending })
  );

  const handleChange = useCallback((value: TFilterValue) => {
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
