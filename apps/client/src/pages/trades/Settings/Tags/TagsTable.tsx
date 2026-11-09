import Stack from '@mui/material/Stack';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { getTags } from '../../../../api/tags';
import { tableFiltersAtom, tablePaginationAtom } from '../../../../components/table/atoms';
import TableMainFooter from '../../../../components/table/TableFooter';
import TableMain from '../../../../components/table/TableMain';
import { QueryKey } from '../../../../enums';
import useColumns from './hooks/useColumns';

const TagsTableMain = () => {
  const { pageIndex: page, pageSize: rowsPerPage } = useAtomValue(tablePaginationAtom);
  const filters = useAtomValue<{ title?: string }>(tableFiltersAtom);

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
