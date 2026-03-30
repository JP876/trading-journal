import { memo, useId } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { usePaginationDispatch } from './providers/Pagination';

type SelectOption = { value: number; label: number | string };

const defaultOptions: SelectOption[] = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
];

type RowsPerPageSelectProps = {
  itemsPerPage: number;
  options?: SelectOption[];
};

const RowsPerPageSelect = ({ itemsPerPage, options = defaultOptions }: RowsPerPageSelectProps) => {
  const inputId = useId();
  const dispatch = usePaginationDispatch();

  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Typography>Rows per page</Typography>
      <Select
        sx={{ width: '3.2rem' }}
        size="small"
        variant="standard"
        value={itemsPerPage}
        onChange={(event) => dispatch({ type: 'updateRowsPerPage', value: event.target.value })}
        slotProps={{
          input: { id: `rows-per-page-select-${inputId}` },
        }}
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

export default memo(RowsPerPageSelect);
