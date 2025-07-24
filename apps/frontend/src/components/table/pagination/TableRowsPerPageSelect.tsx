import { memo } from 'react';
import { MenuItem, Select, Stack, Typography } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';

import { pageAtom, rowsPerPageAtom } from '../tableAtoms';

const defaultOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
];

type TableRowsPerPageSelectProps = {
  options?: { value: number; label: number | string }[];
};

const TableRowsPerPageSelect = ({ options = defaultOptions }: TableRowsPerPageSelectProps) => {
  const [rowsPerPage, setRowsPerPage] = useAtom(rowsPerPageAtom);
  const setPage = useSetAtom(pageAtom);

  const handleChangeRowsPerPage = (event: any) => {
    const value = event.target.value as string;
    setRowsPerPage(+value);
    setPage(1);
  };

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography>Rows per page</Typography>
      <Select
        sx={{ width: '3.2rem' }}
        size="small"
        variant="standard"
        value={rowsPerPage}
        onChange={handleChangeRowsPerPage}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default memo(TableRowsPerPageSelect);
