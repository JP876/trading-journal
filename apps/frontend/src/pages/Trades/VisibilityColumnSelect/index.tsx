import { memo, useId, useMemo } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import useAppStore from '@/store';
import { editLoggedInUser } from '@/api/user';

const columnOptions = [
  { id: 'direction', label: 'Direction' },
  { id: 'result', label: 'Result' },
  { id: 'takeProfit', label: 'Take Profit' },
  { id: 'stopLoss', label: 'Stop Loss' },
  { id: 'pl', label: 'Profit/Loss' },
  { id: 'openDate', label: 'Open Date' },
  { id: 'closeDate', label: 'Close Date' },
  { id: 'comment', label: 'Comment' },
];

const VisibilityColumnSelect = () => {
  const labelId = useId();

  const queryClient = useQueryClient();
  const tradesColumnVisibility = useAppStore((state) => state.user?.userSettings?.tradesColumnVisibility);

  const selectValue = useMemo(() => {
    if (!tradesColumnVisibility) return [];
    return Object.keys(tradesColumnVisibility).filter((key) => tradesColumnVisibility[key]);
  }, [tradesColumnVisibility]);

  const mutation = useMutation({
    mutationFn: editLoggedInUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleOnChange = (event: SelectChangeEvent<typeof selectValue>) => {
    const { target } = event;
    const targetValue = typeof target.value === 'string' ? target.value.split(',') : target.value;

    const nextValue = columnOptions.reduce((acc, el) => {
      return { ...acc, [el.id]: targetValue.some((id) => id === el.id) };
    }, {});
    mutation.mutate({ userSettings: { tradesColumnVisibility: nextValue } });
  };

  return (
    <FormControl size="small" sx={{ width: '12rem' }}>
      <InputLabel id={labelId}>Columns</InputLabel>
      <Select
        id="columns-multiple-checkbox"
        labelId={labelId}
        multiple
        disabled={!tradesColumnVisibility}
        value={selectValue}
        renderValue={(value) => value.map((v) => columnOptions.find((option) => option.id === v)?.label).join(', ')}
        onChange={handleOnChange}
        input={<OutlinedInput label="Columns" />}
      >
        {columnOptions.map((column) => (
          <MenuItem key={column.id} value={column.id} disableRipple sx={{ p: 0.2 }}>
            <Checkbox size="small" checked={tradesColumnVisibility?.[column.id]} />
            <ListItemText primary={column.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(VisibilityColumnSelect);
