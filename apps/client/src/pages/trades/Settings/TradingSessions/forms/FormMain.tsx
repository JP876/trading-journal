import { Controller, type UseFormReturn } from 'react-hook-form';
import Stack from '@mui/material/Stack';

import type { TradingSessionFormSchemaType } from '../../../../../types/tradingSessions';
import FormMain from '../../../../../components/form/FormMain';
import TextInput from '../../../../../components/form/TextInput';
import CheckboxInput from '../../../../../components/form/CheckboxInput';
import SubmitButton from '../../../../../components/form/SubmitButton';

type FormSchema = TradingSessionFormSchemaType;
type TradingSessionFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const TradingSessionForm = ({ onSubmit, form, isLoading }: TradingSessionFormProps) => {
  return (
    <FormMain onSubmit={onSubmit} form={form}>
      <Stack direction="row" alignItems="center" gap={2}>
        <Controller name="title" control={form.control} render={(props) => <TextInput label="Title *" {...props} />} />
        <Controller
          name="isMain"
          control={form.control}
          render={({ field, fieldState, formState }) => {
            return (
              <CheckboxInput
                formControlProps={{
                  sx: { flex: '0 0 30%' },
                }}
                checkboxProps={{
                  disabled: !!formState.defaultValues?.isMain,
                }}
                label="Main Account"
                field={field}
                fieldState={fieldState}
              />
            );
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center">
        <Controller
          name="description"
          control={form.control}
          render={(props) => <TextInput label="Description" inputProps={{ multiline: true, rows: 6 }} {...props} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <SubmitButton loading={isLoading} />
      </Stack>
    </FormMain>
  );
};

export default TradingSessionForm;
