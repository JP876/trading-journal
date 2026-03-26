import { createContext, useContext, useReducer } from 'react';

const PaginationState = createContext<PaginationState | null>(null);
const PaginationDispatch = createContext<React.ActionDispatch<[action: PaginationAction]> | null>(null);

export const usePaginationState = () => {
  const ctx = useContext(PaginationState);
  if (!ctx) {
    throw new Error('usePaginationState must be used within PaginationProvider');
  }
  return ctx;
};

export const usePaginationDispatch = () => {
  const ctx = useContext(PaginationDispatch);
  if (!ctx) {
    throw new Error('usePaginationDispatch must be used within PaginationProvider');
  }
  return ctx;
};

type PaginationState = {
  page: number;
  rowsPerPage: number;
};

type PaginationAction = { type: 'updatePage'; value: number } | { type: 'updateRowsPerPage'; value: number };

const reducer = (state: PaginationState, action: PaginationAction) => {
  switch (action.type) {
    case 'updatePage':
      return { ...state, page: action.value };
    case 'updateRowsPerPage':
      return { ...state, page: 1, rowsPerPage: action.value };
  }
};

type PaginationProviderProps = {
  children: React.ReactNode;
  page?: number;
  rowsPerPage?: number;
};

const PaginationProvider = ({ page, rowsPerPage, children }: PaginationProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    page: page || 1,
    rowsPerPage: rowsPerPage || 10,
  });

  return (
    <PaginationState.Provider value={state}>
      <PaginationDispatch.Provider value={dispatch}>{children}</PaginationDispatch.Provider>
    </PaginationState.Provider>
  );
};

export default PaginationProvider;
