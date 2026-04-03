import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import useColumns from './hooks/useColumns';
import PaginationContainer from '../../../components/table/PaginationContainer';
import RowsPerPageSelect from '../../../components/table/RowsPerPageSelect';
import ResultsMain from '../../../components/table/Results';
import TableMain from '../../../components/table/TableMain';
import useTradesQueryOptions from './hooks/useTradesQueryOptions';

const TradesTableMain = () => {
  const options = useTradesQueryOptions();
  const columns = useColumns();

  const { data, isLoading } = useQuery({ ...options });

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" my={8}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <TableMain data={data?.results || []} columns={columns} />

      {data?.currentPage ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {data?.itemsPerPage ? (
            <ResultsMain currentPage={data.currentPage} itemsPerPage={data.itemsPerPage} totalItems={data.totalItems} />
          ) : null}
          <Stack direction="row" alignItems="center" gap={2}>
            {data?.itemsPerPage ? <RowsPerPageSelect itemsPerPage={data.itemsPerPage} /> : null}
            {data.totalPages ? (
              <PaginationContainer currentPage={data.currentPage} totalPages={data.totalPages} />
            ) : null}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default TradesTableMain;
