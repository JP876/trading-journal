import { createStore, Provider, type Store, type WritableAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { createContext, useMemo } from "react";

type TTableProviderProps = {
  children: React.ReactNode;
  atomValues: Iterable<readonly [WritableAtom<unknown, [any], unknown>, unknown]>;
};

export const TableStoreContext = createContext<Store | undefined>(undefined);

const TableProvider = ({ children, atomValues }: TTableProviderProps) => {
  const store = useMemo(() => createStore(), []);
  useHydrateAtoms(new Map(atomValues), { store });

  return (
    <TableStoreContext value={store}>
      <Provider store={store}>{children}</Provider>
    </TableStoreContext>
  );
};

export default TableProvider;
