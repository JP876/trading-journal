import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';

import { getTags } from '../../../../api/tags';
import { tableFiltersAtom, tablePaginationAtom } from '../../../../components/table/atoms';
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
    <TableMain
      columns={columns}
      data={data?.results || []}
      pageCount={data?.totalPages}
      rowCount={data?.totalItems}
      hidePageSizeSelect
    />
  );
};

export default TagsTableMain;
