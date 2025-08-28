import { useMutation, useQueryClient } from '@tanstack/react-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';

import useAppStore from '@/store';
import { addTag } from '@/api/tags';
import { tagFormSchema, TagFormSchemaType } from '@/types/tags';
import TagForm from '../TagForm';

const AddTagForm = () => {
  const queryClient = useQueryClient();
  const closeModal = useAppStore((state) => state.closeModal);

  const mutation = useMutation({
    mutationFn: addTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal('addTag');
    },
  });

  const form = useForm<TagFormSchemaType>({
    resolver: standardSchemaResolver(tagFormSchema),
  });

  const onSubmit = (data: TagFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <TagForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default AddTagForm;
