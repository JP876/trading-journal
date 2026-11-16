import { createStore, Provider, type Store, type WritableAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { createContext, useMemo } from "react";

type TJotaiProviderProps = {
  children: React.ReactNode;
  atomValues?: Iterable<readonly [WritableAtom<unknown, [any], unknown>, unknown]>;
};

export const JStoreContext = createContext<Store | undefined>(undefined);

const JotaiProvider = ({ children, atomValues }: TJotaiProviderProps) => {
  const store = useMemo(() => createStore(), []);
  useHydrateAtoms(new Map(atomValues), { store });

  return (
    <JStoreContext value={store}>
      <Provider store={store}>{children}</Provider>
    </JStoreContext>
  );
};

export default JotaiProvider;
