import FiltersProvider, { type FiltersProviderProps } from './Filters';
import PaginationProvider, { type TPaginationProviderProps } from './Pagination';

type TableProvidersProps = {
  children: React.ReactNode;
} & FiltersProviderProps &
  TPaginationProviderProps;

const TableProviders = ({ children, initialValues, page, rowsPerPage }: TableProvidersProps) => {
  return (
    <PaginationProvider page={page} rowsPerPage={rowsPerPage}>
      <FiltersProvider initialValues={initialValues}>{children}</FiltersProvider>
    </PaginationProvider>
  );
};

export default TableProviders;
