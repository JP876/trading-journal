import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { createStore, Provider } from 'jotai';
import { lazy, Suspense } from 'react';

import DialogMain from '../../../../components/DialogMain';
import { tablePaginationAtom } from '../../../../components/table/atoms';
import TextFilter from '../../../../components/table/filters/TextFilter';
import useModal from '../../../../hooks/useModal';
import { TradesPageModal } from '../../enums';
import TagsTableMain from './TagsTable';

const EditTagForm = lazy(() => import('./forms/EditForm'));
const DeleteTag = lazy(() => import('./DeleteTag'));

const tagsTableStore = createStore();
tagsTableStore.set(tablePaginationAtom, { pageIndex: 0, pageSize: 10 });

const TagModalList = () => {
  return (
    <Suspense>
      <DialogMain id={TradesPageModal.EDIT_TAG} title="Edit tag">
        <EditTagForm />
      </DialogMain>

      <DialogMain
        id={TradesPageModal.DELETE_TAG}
        title="Are you absolutely sure?"
        hideCloseBtn
        dialogContentProps={{ dividers: false }}
      >
        <DeleteTag />
      </DialogMain>
    </Suspense>
  );
};

const TagsMain = () => {
  const { openModal } = useModal();

  return (
    <Provider store={tagsTableStore}>
      <Stack spacing={2}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <TextFilter name="title" label="Title" />
          </Box>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => openModal(TradesPageModal.ADD_TAG)}
            >
              Add tag
            </Button>
          </Stack>
        </Stack>
        <TagsTableMain />
      </Stack>

      <TagModalList />
    </Provider>
  );
};

export default TagsMain;
