import { useQuery } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';

import { QueryKey } from '../../../../enums';
import { getTags } from '../../../../api/tags';
import useColumns from './hooks/useColumns';
import TableMain from '../../../../components/table/TableMain';

const TagsTableMain = () => {
  const { data } = useQuery({
    queryKey: [QueryKey.TAGS],
    queryFn: () => getTags(),
    staleTime: Infinity,
  });

  const columns = useColumns();

  return (
    <Stack direction="row" alignItems="center">
      <TableMain columns={columns} data={data || []} />
    </Stack>
  );
};

export default TagsTableMain;
