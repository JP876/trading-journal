import Pagination, { type PaginationProps } from '@mui/material/Pagination';
import { memo } from 'react';

import { usePaginationDispatch } from './providers/Pagination';

type PaginationContainerProps = {
  currentPage: number;
  totalPages: number;
  paginationProps?: Omit<PaginationProps, 'count' | 'page' | 'onChange'>;
  onChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
};

const PaginationContainer = ({ currentPage, totalPages, paginationProps, onChange }: PaginationContainerProps) => {
  const dispatch = usePaginationDispatch();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch({ type: 'updatePage', value });
    if (onChange) {
      onChange(event, value);
    }
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
