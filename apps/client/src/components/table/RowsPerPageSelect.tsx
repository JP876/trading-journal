import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSetAtom } from 'jotai';
import { memo, useId } from 'react';

import { updateRowsPerPageAtom } from './atoms';

type SelectOption = { value: number; label: number | string };

const defaultOptions: SelectOption[] = [
  { value: 10, label: 10 },
  { value: 20, label: 20 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

type RowsPerPageSelectProps = {
  itemsPerPage: number;
  options?: SelectOption[];
};

const RowsPerPageSelect = ({ itemsPerPage, options = defaultOptions }: RowsPerPageSelectProps) => {
  const inputId = useId();

  const updateRowsPerPage = useSetAtom(updateRowsPerPageAtom);

  return (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Typography>Rows per page</Typography>
      <Select
        sx={{ width: '3.2rem' }}
        size="small"
        variant="standard"
        value={itemsPerPage}
        onChange={(event) => updateRowsPerPage(event.target.value)}
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
