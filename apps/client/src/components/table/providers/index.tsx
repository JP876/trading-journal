import FiltersProvider, { type FiltersProviderProps } from './Filters';
import PaginationProvider from './Pagination';

type TableProvidersProps = {
  children: React.ReactNode;
} & FiltersProviderProps;

const TableProviders = ({ children, initialValues }: TableProvidersProps) => {
  return (
    <PaginationProvider>
      <FiltersProvider initialValues={initialValues}>{children}</FiltersProvider>
    </PaginationProvider>
  );
};

export default TableProviders;
