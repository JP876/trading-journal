import { Button, Divider, Stack } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';

import { TagFormSchemaType } from '@/types/tags';
import FormMain from '@/components/form/FormMain';
import TextInput from '@/components/form/TextInput';
import ColorInput from '@/components/form/ColorInput';

type FormSchema = TagFormSchemaType;
type TagFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const TagForm = ({ onSubmit, form, isLoading }: TagFormProps) => {
  return (
    <FormMain onSubmit={onSubmit} form={form}>
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => <TextInput label="Title" field={field} />}
      />
      <Controller
        name="color"
        control={form.control}
        render={({ field }) => <ColorInput label="Color" field={field} />}
      />

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button loading={isLoading} startIcon={<CheckIcon />} size="small" variant="contained" type="submit">
          Confirm
        </Button>
      </Stack>
    </FormMain>
  );
};

export default TagForm;
