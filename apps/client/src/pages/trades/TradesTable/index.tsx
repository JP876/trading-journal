import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import useColumns from './hooks/useColumns';
import TableMain from '../../../components/table/TableMain';
import useTradesQueryOptions from './hooks/useTradesQueryOptions';
import TableMainFooter from '../../../components/table/TableFooter';

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
      <TableMainFooter
        totalItems={data?.totalItems}
        totalPages={data?.totalPages}
        itemsPerPage={data?.itemsPerPage}
        currentPage={data?.currentPage}
      />
    </Stack>
  );
};

export default TradesTableMain;
