import { Controller, type UseFormReturn } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import type { TradingSessionFormSchemaType } from '../../../../../types/tradingSessions';
import FormMain from '../../../../../components/form/FormMain';
import TextInput from '../../../../../components/form/TextInput';
import CheckboxInput from '../../../../../components/form/CheckboxInput';
import SubmitButton from '../../../../../components/form/SubmitButton';
import AutocompleteInput from '../../../../../components/form/AutocompleteInput';
import usePairsOptions from '../../../hooks/usePairsOptions';
import DateTimeInput from '../../../../../components/form/DateTimeInput';

type FormSchema = TradingSessionFormSchemaType;
type TradingSessionFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const TradingSessionForm = ({ onSubmit, form, isLoading }: TradingSessionFormProps) => {
  const pairsOptions = usePairsOptions();

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

      <Divider sx={{ my: 2 }}>Default trade values</Divider>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="defaultPairId"
          control={form.control}
          render={(props) => <AutocompleteInput {...props} options={pairsOptions} label="Pair" />}
        />
        <Controller
          name="defaultOpenDate"
          control={form.control}
          render={(props) => <DateTimeInput label="Open Date" inputProps={{ disableFuture: true }} {...props} />}
        />
      </Stack>

      <Stack direction="row" alignContent="center" gap={4}>
        <Controller
          name="defaultTakeProfit"
          control={form.control}
          render={(props) => <TextInput label="Take Profit" {...props} inputProps={{ type: 'number' }} />}
        />
        <Controller
          name="defaultStopLoss"
          control={form.control}
          render={(props) => <TextInput label="Stop Loss" {...props} inputProps={{ type: 'number' }} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <SubmitButton loading={isLoading} />
      </Stack>
    </FormMain>
  );
};

export default TradingSessionForm;
