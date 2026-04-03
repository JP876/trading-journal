import { Controller, type UseFormReturn } from 'react-hook-form';
import Stack from '@mui/material/Stack';

import type { TagFormSchemaType } from '../../../../../types/tag';
import SubmitButton from '../../../../../components/form/SubmitButton';
import FormMain from '../../../../../components/form/FormMain';
import TextInput from '../../../../../components/form/TextInput';
import ColorInput from '../../../../../components/form/ColorInput';

type FormSchema = TagFormSchemaType;
type TagFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const TagForm = ({ onSubmit, form, isLoading }: TagFormProps) => {
  return (
    <FormMain onSubmit={onSubmit} form={form}>
      <Controller name="title" control={form.control} render={(props) => <TextInput label="Title *" {...props} />} />
      <Controller name="color" control={form.control} render={(props) => <ColorInput {...props} label="Color *" />} />

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <SubmitButton loading={isLoading} />
      </Stack>
    </FormMain>
  );
};

export default TagForm;
