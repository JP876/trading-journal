import { memo } from 'react';
import { Stack, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';

import { filtersAtom, pageAtom, rowsPerPageAtom } from '../tableAtoms';

const isEmpty = (object: { [key: string]: string }) => {
  if (!object) return false;
  return Object.values(object).every((x) => x === null || x === '');
};

const TotalCountText = ({ totalCount = 0 }: { totalCount: number }) => {
  const filters = useAtomValue(filtersAtom);

  if (!totalCount || isEmpty(filters)) return null;
  return <Typography>Total count: {totalCount}</Typography>;
};

const TableResults = ({ count = 0, totalCount = 0 }: { count?: number; totalCount?: number }) => {
  const page = useAtomValue(pageAtom);
  const rowsPerPage = useAtomValue(rowsPerPageAtom);

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography>
        Results {page === 1 ? 1 : page - 1 + rowsPerPage} - {page * rowsPerPage > count ? count : page * rowsPerPage}{' '}
        out of {count}
      </Typography>
      <TotalCountText totalCount={totalCount} />
    </Stack>
  );
};

export default memo(TableResults);
