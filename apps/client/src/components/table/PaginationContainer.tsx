import { memo } from 'react';
import Pagination, { type PaginationProps } from '@mui/material/Pagination';

import { usePaginationDispatch } from './providers/Pagination';

type PaginationContainerProps = {
  currentPage: number;
  totalPages: number;
  paginationProps?: Omit<PaginationProps, 'count' | 'page' | 'onChange'>;
};

const PaginationContainer = ({ currentPage, totalPages, paginationProps }: PaginationContainerProps) => {
  const dispatch = usePaginationDispatch();

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: 'updatePage', value });
  };

  return (
    <Pagination
      showFirstButton
      showLastButton
      variant="outlined"
      shape="rounded"
      {...(paginationProps || {})}
      disabled={totalPages === 1 || paginationProps?.disabled}
      count={totalPages}
      page={currentPage}
      onChange={handleChange}
    />
  );
};

export default memo(PaginationContainer);
