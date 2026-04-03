import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useAtomValue } from 'jotai';

import useModal from '../../../../hooks/useModal';
import { TradesPageModal } from '../../enums';
import TagsTableMain from './TagsTable';
import DialogMain from '../../../../components/DialogMain';
import { modalAtom } from '../../../../atoms/modal';
import EditTagForm from './forms/EditForm';
import type { Tag } from '../../../../types/tag';
import DeleteTag from './DeleteTag';

const TagModalList = () => {
  const modalInfo = useAtomValue(modalAtom);

  return (
    <>
      <DialogMain id={TradesPageModal.EDIT_TAG} title="Edit tag">
        <EditTagForm tag={modalInfo?.[TradesPageModal.EDIT_TAG]?.data as Tag} />
      </DialogMain>

      <DialogMain
        id={TradesPageModal.DELETE_TAG}
        title="Are you absolutely sure?"
        hideCloseBtn
        dialogContentProps={{ dividers: false }}
      >
        <DeleteTag tag={modalInfo?.[TradesPageModal.DELETE_TAG]?.data as Tag} />
      </DialogMain>
    </>
  );
};

const TagsMain = () => {
  const { openModal } = useModal();

  return (
    <>
      <Stack gap={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box></Box>
          <Stack direction="row" alignItems="center" gap={2}>
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
    </>
  );
};

export default TagsMain;
