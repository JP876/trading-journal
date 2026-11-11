import { createStore, Provider, type Store } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { createContext, useMemo } from "react";

import { tableFiltersAtom, tablePaginationAtom, type TTableFilters } from "./atoms";

type TTableProviderProps = {
  children: React.ReactNode;
  pageSize?: number;
  pageIndex?: number;
  filters?: TTableFilters;
};

export const TableStoreContext = createContext<Store | null>(null);

const TableProvider = ({ children, pageIndex, pageSize, filters }: TTableProviderProps) => {
  const store = useMemo(() => createStore(), []);

  const initialValues = useMemo(() => {
    const values = new Map();

    if (pageIndex || pageSize) values.set(tablePaginationAtom, { pageIndex: pageIndex ?? 0, pageSize: pageSize || 20 });
    if (filters) values.set(tableFiltersAtom, { ...filters });

    return values;
  }, [pageIndex, pageSize, filters]);

  useHydrateAtoms(initialValues, { store });

  return (
    <TableStoreContext value={store}>
      <Provider store={store}>{children}</Provider>
    </TableStoreContext>
  );
};

export default TableProvider;
