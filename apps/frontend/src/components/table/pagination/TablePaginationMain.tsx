import React, { memo } from 'react';
import { Pagination } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';

import { pageAtom, rowsPerPageAtom } from '../tableAtoms';

type TablePaginationMain = {
  count: number;
};

const TablePaginationMain = ({ count }: TablePaginationMain) => {
  const [page, setPage] = useAtom(pageAtom);
  const rowsPerPage = useAtomValue(rowsPerPageAtom);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Pagination
      showFirstButton
      showLastButton
      variant="outlined"
      shape="rounded"
      count={Math.ceil(count / rowsPerPage)}
      page={page}
      onChange={handlePageChange}
    />
  );
};

export default memo(TablePaginationMain);
