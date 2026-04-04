import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';

import { QueryKey } from '../../../../enums';
import { getTags } from '../../../../api/tags';
import useColumns from './hooks/useColumns';
import TableMain from '../../../../components/table/TableMain';
import { usePaginationState } from '../../../../components/table/providers/Pagination';
import { useFiltersState } from '../../../../components/table/providers/Filters';
import TableMainFooter from '../../../../components/table/TableFooter';

const TagsTableMain = () => {
  const { page, rowsPerPage } = usePaginationState();
  const filters = useFiltersState() as { title?: string };

  const { data } = useQuery({
    queryKey: [QueryKey.TAGS, page, rowsPerPage, filters.title],
    queryFn: () => getTags({ page, rowsPerPage, title: filters.title }),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });

  const columns = useColumns();

  return (
    <Stack gap={2}>
      <TableMain columns={columns} data={data?.results || []} />
      <TableMainFooter
        totalItems={data?.totalItems}
        totalPages={data?.totalPages}
        itemsPerPage={data?.itemsPerPage}
        currentPage={data?.currentPage}
        hideRowPerPage
      />
    </Stack>
  );
};

export default TagsTableMain;
