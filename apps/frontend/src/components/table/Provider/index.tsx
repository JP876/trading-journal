import React from 'react';
import { createStore, Provider } from 'jotai';

import { filtersAtom, pageAtom, rowsPerPageAtom } from '../tableAtoms';

const tableStore = createStore();

tableStore.set(pageAtom, 1);
tableStore.set(rowsPerPageAtom, 10);
tableStore.set(filtersAtom, {});

type TableProviderMainProps = {
  children: React.ReactNode;
};

const TableProviderMain = ({ children }: TableProviderMainProps) => {
  return <Provider>{children}</Provider>;
};

export default TableProviderMain;
