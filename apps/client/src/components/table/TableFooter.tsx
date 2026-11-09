import Stack from '@mui/material/Stack';
import { memo, useCallback } from 'react';

import type { PaginationInfo } from '../../types';
import RowsPerPageSelect from './RowsPerPageSelect';
import PaginationContainer from './PaginationContainer';
import ResultsMain from './Results';

type TTableMainFooterProps = {
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
}: TTableMainFooterProps) => {
  const handleScroll = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!currentPage) return null;

  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {itemsPerPage && totalItems && !hideResults ? (
        <ResultsMain currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
      ) : null}
      <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        {itemsPerPage && totalItems && !hideRowPerPage ? <RowsPerPageSelect itemsPerPage={itemsPerPage} /> : null}
        {totalPages && !hidePagination ? (
          <PaginationContainer currentPage={currentPage} totalPages={totalPages} onChange={handleScroll} />
        ) : null}
      </Stack>
    </Stack>
  );
};

export default memo(TableMainFooter);
