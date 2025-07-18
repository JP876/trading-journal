import { Button, Divider, Stack } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import CheckIcon from '@mui/icons-material/Check';

import { directionItems, pairOptions, resultItems } from './consts';
import AutocompleteInput from '@/components/form/AutocompleteInput';
import SelectInput from '@/components/form/SelectInput';
import TextInput from '@/components/form/TextInput';
import DateTimeInput from '@/components/form/DateTimeInput';
import FormMain from '@/components/form/FormMain';
import { EditTradeFormSchemaType, TradeFormSchemaType } from '@/types/trades';

type FormSchema = TradeFormSchemaType | EditTradeFormSchemaType;
type TradeFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading: boolean;
};

const TradeForm = ({ onSubmit, form, isLoading }: TradeFormProps) => {
  return (
    <FormMain onSubmit={onSubmit} form={form}>
      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="pair"
          control={form.control}
          render={({ field }) => <AutocompleteInput field={field} options={pairOptions} label="Pair *" />}
        />
        <Controller
          name="direction"
          control={form.control}
          render={({ field }) => <SelectInput options={directionItems} label="Direction *" field={field} />}
        />
        <Controller
          name="result"
          control={form.control}
          render={({ field }) => <SelectInput options={resultItems} label="Result *" field={field} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="stopLoss"
          control={form.control}
          render={({ field }) => <TextInput label="Stop Loss *" field={field} type="number" />}
        />
        <Controller
          name="takeProfit"
          control={form.control}
          render={({ field }) => <TextInput label="Take Profit *" field={field} type="number" />}
        />
        <Controller
          name="pl"
          control={form.control}
          render={({ field }) => <TextInput label="Profit/Loss" field={field} type="number" />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="openDate"
          control={form.control}
          render={({ field }) => <DateTimeInput label="Open Date" field={field} />}
        />
        <Controller
          name="closeDate"
          control={form.control}
          render={({ field }) => <DateTimeInput label="Close Date" field={field} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center">
        <Controller
          name="comment"
          control={form.control}
          render={({ field }) => <TextInput label="Comment" field={field} fullWidth multiline rows={6} />}
        />
      </Stack>

      {/* <Stack direction="row" alignItems="center">
        <Controller name="files" control={form.control} render={({ field }) => <UploadFilesInput field={field} />} />
      </Stack> */}

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <Button loading={isLoading} startIcon={<CheckIcon />} size="small" variant="contained" type="submit">
          Confirm
        </Button>
      </Stack>
    </FormMain>
  );
};

export default TradeForm;
