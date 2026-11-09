import Pagination, { type PaginationProps } from '@mui/material/Pagination';
import { useSetAtom } from 'jotai';
import { memo } from 'react';

import { updatePageAtom } from './atoms';

type PaginationContainerProps = {
  currentPage: number;
  totalPages: number;
  paginationProps?: Omit<PaginationProps, 'count' | 'page' | 'onChange'>;
  onChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
};

const PaginationContainer = ({ currentPage, totalPages, paginationProps, onChange }: PaginationContainerProps) => {
  const updatePage = useSetAtom(updatePageAtom);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    updatePage(value);
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
