import Stack from '@mui/material/Stack';

import type { PaginationInfo } from '../../types';
import RowsPerPageSelect from './RowsPerPageSelect';
import PaginationContainer from './PaginationContainer';
import ResultsMain from './Results';
import { memo } from 'react';

type TableMainFooterProps = {
  hideResults?: boolean;
  hideRowPerPage?: boolean;
  hidePagination?: boolean;
} & Partial<Omit<PaginationInfo, 'results'>>;

const TableMainFooter = ({
  totalItems,
  totalPages,
  itemsPerPage,
  currentPage,
  hideResults,
  hidePagination,
  hideRowPerPage,
}: TableMainFooterProps) => {
  if (!currentPage) return null;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      {itemsPerPage && totalItems && !hideResults ? (
        <ResultsMain currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
      ) : null}
      <Stack direction="row" alignItems="center" gap={2}>
        {itemsPerPage && totalItems && !hideRowPerPage ? <RowsPerPageSelect itemsPerPage={itemsPerPage} /> : null}
        {totalPages && !hidePagination ? (
          <PaginationContainer currentPage={currentPage} totalPages={totalPages} />
        ) : null}
      </Stack>
    </Stack>
  );
};

export default memo(TableMainFooter);
