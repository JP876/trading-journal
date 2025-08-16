import React, { memo } from 'react';
import { Pagination, type PaginationProps } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';

import { pageAtom, rowsPerPageAtom } from '../tableAtoms';

type TablePaginationMain = {
  count: number;
  paginationProps?: Omit<PaginationProps, 'count' | 'page' | 'onChange'>;
};

const TablePaginationMain = (props: TablePaginationMain) => {
  const [page, setPage] = useAtom(pageAtom);
  const rowsPerPage = useAtomValue(rowsPerPageAtom);

  const count = Math.ceil(props.count / rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Pagination
      showFirstButton
      showLastButton
      variant="outlined"
      shape="rounded"
      {...(props?.paginationProps || {})}
      disabled={count === 1 || props?.paginationProps?.disabled}
      count={count}
      page={page}
      onChange={handlePageChange}
    />
  );
};

export default memo(TablePaginationMain);
