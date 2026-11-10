import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { editTag } from '../../../../../../api/tags';
import { QueryKey } from '../../../../../../enums';
import useModal from '../../../../../../hooks/useModal';
import useModalData from '../../../../../../hooks/useModalData';
import useSnackbar from '../../../../../../hooks/useSnackbar';
import { TagFormSchema, type Tag, type TagFormSchemaType } from '../../../../../../types/tag';
import { TradesPageModal } from '../../../../enums';
import TagForm from '../FormMain';

const EditTagForm = () => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const tag = useModalData<Tag>(TradesPageModal.EDIT_TAG);

  const mutation = useMutation({
    mutationFn: (data: TagFormSchemaType) => {
      if (!tag) {
        throw new Error(`Tag details not found: ${tag}`);
      }
      return editTag(tag!.id, data);
    },
    onSuccess: async () => {
      if (!tag) {
        throw new Error(`Tag details not found: ${tag}`);
      }
      await queryClient.invalidateQueries({ queryKey: [QueryKey.TAGS] });
      closeModal(TradesPageModal.EDIT_TAG);
      openSnackbar({ severity: 'success', message: 'Your tag details have been saved.' });
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your tag.' });
    },
  });

  const form = useForm<TagFormSchemaType>({
    resolver: standardSchemaResolver(TagFormSchema),
    defaultValues: tag,
  });

  const onSubmit = (data: TagFormSchemaType) => {
    if (!tag?.id) {
      console.error(`Tag details not found: ${tag}`);
      return;
    }
    mutation.mutate({ ...data });
  };

  return <TagForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default EditTagForm;
