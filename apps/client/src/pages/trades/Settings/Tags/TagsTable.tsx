import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Stack from '@mui/material/Stack';

import { QueryKey } from '../../../../enums';
import { getTags } from '../../../../api/tags';
import useColumns from './hooks/useColumns';
import TableMain from '../../../../components/table/TableMain';
import { usePaginationState } from '../../../../components/table/providers/Pagination';
import { useFiltersState } from '../../../../components/table/providers/Filters';
import PaginationContainer from '../../../../components/table/PaginationContainer';
import ResultsMain from '../../../../components/table/Results';

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
      <Stack direction="row" alignItems="center">
        <TableMain columns={columns} data={data?.results || []} />
      </Stack>

      {data?.currentPage ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ResultsMain currentPage={data.currentPage} itemsPerPage={data.itemsPerPage} totalItems={data.totalItems} />
          <Stack direction="row" alignItems="center" gap={2}>
            <PaginationContainer currentPage={data.currentPage} totalPages={data.totalPages} />
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default TagsTableMain;
