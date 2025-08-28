import { Box, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useAppStore from '@/store';
import TagsTableMain from './TagsTable';

const AddTagBtn = () => {
  const openModal = useAppStore((state) => state.openModal);
  return (
    <Button startIcon={<AddIcon />} size="small" variant="contained" onClick={() => openModal({ id: 'addTag' })}>
      Add Tag
    </Button>
  );
};

const TagsMain = () => {
  return (
    <Stack gap={2}>
      <Box>
        <AddTagBtn />
      </Box>
      <TagsTableMain />
    </Stack>
  );
};

export default TagsMain;
