import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { QueryKey } from '../../../../../../enums';
import { editTag } from '../../../../../../api/tags';
import { TradesPageModal } from '../../../../enums';
import { TagFormSchema, type Tag, type TagFormSchemaType } from '../../../../../../types/tag';
import TagForm from '../FormMain';
import useSnackbar from '../../../../../../hooks/useSnackbar';
import useModal from '../../../../../../hooks/useModal';

type EditTagFormProps = {
  tag: Tag;
};

const EditTagForm = ({ tag }: EditTagFormProps) => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const mutation = useMutation({
    mutationFn: (data: TagFormSchemaType) => editTag(tag.id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QueryKey.TAGS] }),
        queryClient.invalidateQueries({ queryKey: [QueryKey.TRADES] }),
      ]);
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
    mutation.mutate({ ...data });
  };

  return <TagForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default EditTagForm;
