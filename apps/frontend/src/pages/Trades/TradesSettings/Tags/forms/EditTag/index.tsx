import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { tagFormSchema, TagFormSchemaType, TagType } from '@/types/tags';
import useAppStore from '@/store';
import { editTag } from '@/api/tags';
import TagForm from '../TagForm';

type EditTagFormProps = {
  tag: TagType;
};

const EditTagForm = ({ tag }: EditTagFormProps) => {
  const queryClient = useQueryClient();
  const closeModal = useAppStore((state) => state.closeModal);

  const mutation = useMutation({
    mutationFn: (data: TagFormSchemaType) => editTag(tag?._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal('editTag');
    },
  });

  const form = useForm<TagFormSchemaType>({
    resolver: standardSchemaResolver(tagFormSchema),
    defaultValues: tag,
  });

  const onSubmit = (data: TagFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return <TagForm form={form} onSubmit={onSubmit} isLoading={mutation.isPending} />;
};

export default EditTagForm;
