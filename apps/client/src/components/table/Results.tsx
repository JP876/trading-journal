import { memo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type ResultsMainProps = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
};

const ResultsMain = ({ currentPage, itemsPerPage, totalItems }: ResultsMainProps) => {
  if (!totalItems) {
    return <Stack direction="row" alignItems="center" gap={2}></Stack>;
  }

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography>
        Results {((currentPage || 1) - 1) * itemsPerPage + 1} -{' '}
        {currentPage * itemsPerPage > totalItems ? totalItems : currentPage * itemsPerPage} out of {totalItems}
      </Typography>
    </Stack>
  );
};

export default memo(ResultsMain);
