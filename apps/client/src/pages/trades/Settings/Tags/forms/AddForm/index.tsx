import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { TagFormSchema, type TagFormSchemaType } from '../../../../../../types/tag';
import { addTag } from '../../../../../../api/tags';
import { QueryKey } from '../../../../../../enums';
import { TradesPageModal } from '../../../../enums';
import useSnackbar from '../../../../../../hooks/useSnackbar';
import useModal from '../../../../../../hooks/useModal';
import TagForm from '../FormMain';

const AddTagForm = () => {
  const queryClient = useQueryClient();

  const { openSnackbar } = useSnackbar();
  const { closeModal } = useModal();

  const mutation = useMutation({
    mutationFn: addTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TAGS] });
      closeModal(TradesPageModal.ADD_TAG);
      openSnackbar({ severity: 'success', message: 'Your tag details have been saved.' });
    },
    onError: () => {
      openSnackbar({ severity: 'error', message: 'Something went wrong while submitting your tag.' });
    },
  });

  const form = useForm<TagFormSchemaType>({
    resolver: standardSchemaResolver(TagFormSchema),
    defaultValues: { title: '', color: '' },
  });

  const onSubmit = (data: TagFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <TagForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default AddTagForm;
