import { useId } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getAccounts, updateAccount } from '@/api/accounts';

const AccountsSelect = () => {
  const labelId = useId();

  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });

  const mutation = useMutation({
    mutationFn: (id: string) => updateAccount(id, { isMain: true }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({ queryKey: ['trades'] }),
      ]);
    },
  });

  const handleOnChange = (event: SelectChangeEvent) => {
    mutation.mutate(event.target.value);
  };

  return (
    <Box sx={{ minWidth: '12rem' }}>
      <FormControl size="small" fullWidth>
        <InputLabel id={labelId}>Main account</InputLabel>
        <Select
          labelId={labelId}
          id="accounts-simple-select"
          value={(data || []).find((el) => el?.isMain)?._id || ''}
          label="Main account"
          onChange={handleOnChange}
        >
          {(data || []).map((el) => (
            <MenuItem key={el?._id} value={el._id}>
              {el?.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default AccountsSelect;
