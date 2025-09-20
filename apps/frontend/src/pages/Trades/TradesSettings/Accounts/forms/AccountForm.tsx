import { Divider, Stack, Button, Typography } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';

import FormMain from '@/components/form/FormMain';
import TextInput from '@/components/form/TextInput';
import CheckboxInput from '@/components/form/CheckboxInput';
import { AccountFormSchemaType } from '@/types/accounts';

type FormSchema = AccountFormSchemaType;
type AccountFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const AccountForm = ({ onSubmit, form, isLoading }: AccountFormProps) => {
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
                disabled={formState.defaultValues?.isMain}
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

      <Divider>
        <Typography variant="body2">Default trade values</Typography>
      </Divider>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="defaultTakeProfit"
          control={form.control}
          render={({ field }) => <TextInput label="Take profit" field={field} type="number" />}
        />
        <Controller
          name="defaultStopLoss"
          control={form.control}
          render={({ field }) => <TextInput label="Stop loss" field={field} type="number" />}
        />
      </Stack>

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button loading={isLoading} startIcon={<CheckIcon />} size="small" variant="contained" type="submit">
          Confirm
        </Button>
      </Stack>
    </FormMain>
  );
};

export default AccountForm;
