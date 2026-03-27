import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { QueryKey } from '../../../../enums';
import { getTradingSessions } from '../../../../api/tradingSessions';
import useColumns from './hooks/useColumns';
import TableMain from '../../../../components/table/TableMain';

const TradingSessionsTable = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.TRADING_SESSIONS],
    queryFn: getTradingSessions,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const columns = useColumns();

  if (isLoading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" my={8}>
        <CircularProgress />
      </Stack>
    );
  }

  return <TableMain data={data || []} columns={columns} />;
};

export default TradingSessionsTable;
