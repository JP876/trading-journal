import { createContext, useContext, useReducer } from 'react';

const FiltersState = createContext<FiltersStateType>({});
const FiltersDispatch = createContext<React.ActionDispatch<[action: FiltersAction]> | null>(null);

export function useFiltersState() {
  const ctx = useContext(FiltersState);
  if (!ctx) {
    throw new Error('useFiltersState must be used within FiltersProvider');
  }
  return ctx;
}

export const useFiltersDispatch = () => {
  const ctx = useContext(FiltersDispatch);
  if (!ctx) {
    throw new Error('useFiltersDispatch must be used within FiltersProvider');
  }
  return ctx;
};

export type FilterValue = string | number | null;
type FiltersStateType = Record<string, FilterValue>;

type FiltersAction = { type: 'updateFilter'; value: { id: string; value: FilterValue } } | { type: 'resetFilters' };

const reducer = (state: FiltersStateType, action: FiltersAction) => {
  switch (action.type) {
    case 'updateFilter':
      return { ...state, [action.value.id]: action.value.value };
    case 'resetFilters':
      return {};
  }
};

export type FiltersProviderProps = {
  children: React.ReactNode;
  initialValues?: FiltersStateType;
};

function FiltersProvider({ children, initialValues }: FiltersProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialValues || {});

  return (
    <FiltersState.Provider value={state}>
      <FiltersDispatch.Provider value={dispatch}>{children}</FiltersDispatch.Provider>
    </FiltersState.Provider>
  );
}

export default FiltersProvider;
