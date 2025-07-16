import { Box, Stack } from '@mui/material';

import AddAccountBtn from './AddAccountBtn';
import AccountsTable from './AccoutsTable';

const AccountsMain = () => {
  return (
    <Stack gap={2}>
      <Box>
        <AddAccountBtn />
      </Box>
      <AccountsTable />
    </Stack>
  );
};

export default AccountsMain;
