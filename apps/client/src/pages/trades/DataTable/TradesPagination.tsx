import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type tradesPaginationProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number | undefined;
  perPageCount: number | undefined;
};

const TradesPagination = ({ page, setPage, totalCount = 0, perPageCount = 0 }: tradesPaginationProps) => {
  const pages = Math.ceil(totalCount / perPageCount);

  const handlePreviousPage = () => setPage((prevPage: number) => prevPage - 1);
  const handleNextPage = () => setPage((prevPage: number) => prevPage + 1);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size="sm" variant="outline" onClick={handlePreviousPage} disabled={page === 1}>
        <ChevronLeft />
        Previous
      </Button>
      <Button size="sm" variant="outline" onClick={handleNextPage} disabled={page === pages}>
        Next
        <ChevronRight />
      </Button>
    </div>
  );
};

export default memo(TradesPagination);
