import { useEffect } from 'react';
import Box from '@mui/material/Box';

import SettingsNavigation from './SettingsNavigation';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKey } from '../../../enums';
import { getTags } from '../../../api/tags';

const TradesSettingsMain = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: [QueryKey.TAGS, 1, 10, undefined],
      queryFn: () => getTags({ page: 1, rowsPerPage: 10, title: '' }),
      staleTime: Infinity,
    });
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <SettingsNavigation />
    </Box>
  );
};

export default TradesSettingsMain;
