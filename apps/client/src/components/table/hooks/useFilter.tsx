import { useDebouncer } from '@tanstack/react-pacer';
import { atom, useAtomValue, useSetAtom, type Store } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { tableFiltersAtom, updateFiltersAtom, updatePageAtom, type TFilterValue } from '../atoms';

type FiltersHookProps = {
  name: string;
  initialValue: TFilterValue;
  store?: Store;
  wait?: number;
};

function useFilter({ name, initialValue, store, wait = 600 }: FiltersHookProps) {
  const justMounted = useRef(true);

  const filterValueAtom = useMemo(() => {
    return atom((get) => get(tableFiltersAtom)?.[name]);
  }, [name]);

  const updateFilters = useSetAtom(updateFiltersAtom, { store });
  const updatePage = useSetAtom(updatePageAtom, { store });

  const filtersValue = useAtomValue(filterValueAtom);
  const [filterValue, setFilterValue] = useState<TFilterValue>(initialValue);

  const debouncer = useDebouncer(
    (value) => {
      updateFilters({ [name]: value });
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
    if (!justMounted.current && !filtersValue) {
      setFilterValue(null);
    }
    justMounted.current = false;
  }, [filtersValue]);

  return [filterValue, handleChange, { ...debouncer.state }] as const;
}

export default useFilter;
