import { Controller, type UseFormReturn } from 'react-hook-form';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';

import type { TradingSessionFormSchemaType } from '../../../../../types/tradingSessions';
import FormMain from '../../../../../components/form/FormMain';
import TextInput from '../../../../../components/form/TextInput';
import CheckboxInput from '../../../../../components/form/CheckboxInput';

type FormSchema = TradingSessionFormSchemaType;
type TradingSessionFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const TradingSessionForm = ({ onSubmit, form, isLoading }: TradingSessionFormProps) => {
  return (
    <FormMain onSubmit={onSubmit} form={form}>
      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="title"
          control={form.control}
          render={({ field }) => <TextInput label="Title" field={field} />}
        />
        <Controller
          name="isMain"
          control={form.control}
          render={({ field, formState }) => {
            return (
              <CheckboxInput
                formControlLabelProps={{ sx: { flex: '0 0 30%' } }}
                disabled={!!formState.defaultValues?.isMain}
                label="Main Account"
                field={field}
              />
            );
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center">
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <TextInput label="Description" field={field} inputProps={{ multiline: true, rows: 6 }} />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button loading={isLoading} startIcon={<CheckIcon />} size="small" variant="contained" type="submit">
          Confirm
        </Button>
      </Stack>
    </FormMain>
  );
};

export default TradingSessionForm;
