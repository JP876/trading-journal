import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import { Controller, type UseFormReturn } from 'react-hook-form';

import type { ClosedBy, Direction, TradeFormSchemaType } from '../../../types/trade';
import FormMain from '../../../components/form/FormMain';
import TextInput from '../../../components/form/TextInput';
import SelectInput from '../../../components/form/SelectInput';
import DateTimeInput from '../../../components/form/DateTimeInput';
import AutocompleteInput from '../../../components/form/AutocompleteInput';
import { closedByOptions, directonOptions, orderTypeOptions, resultOptions } from '../consts';
import usePairOptions from '../hooks/usePairOptions';

type FormSchema = TradeFormSchemaType;
type TradeFormProps = {
  onSubmit: (data: FormSchema) => void;
  form: UseFormReturn<FormSchema, any, FormSchema>;
  isLoading?: boolean;
};

const TradeForm = ({ onSubmit, form, isLoading }: TradeFormProps) => {
  const pairOptions = usePairOptions();

  return (
    <FormMain<FormSchema> onSubmit={onSubmit} form={form}>
      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="pairId"
          control={form.control}
          render={({ field }) => <AutocompleteInput field={field} options={pairOptions} label="Pair *" />}
        />
        <Controller
          name="result"
          control={form.control}
          render={({ field }) => <SelectInput options={resultOptions} label="Result *" field={field} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="closedBy"
          control={form.control}
          render={({ field }) => <SelectInput options={closedByOptions} label="Closed by" field={field} />}
        />
        <Controller
          name="closedAt"
          control={form.control}
          render={({ field }) => (
            <TextInput
              label="Closed at"
              field={field}
              type="number"
              inputProps={({ watch }) => {
                const closedBy: ClosedBy = watch('closedBy');
                return { disabled: closedBy === 'tp/sl' };
              }}
            />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="direction"
          control={form.control}
          render={({ field }) => <SelectInput options={directonOptions} label="Direction *" field={field} />}
        />
        <Controller
          name="orderType"
          control={form.control}
          render={({ field }) => (
            <SelectInput
              options={orderTypeOptions}
              label="Order type"
              field={field}
              inputProps={({ watch }) => {
                const direction: Direction | undefined = watch('direction');
                return { disabled: !direction };
              }}
            />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={3}>
        <Controller
          name="takeProfit"
          control={form.control}
          render={({ field }) => <TextInput label="Take Profit *" field={field} type="number" />}
        />
        <Controller
          name="stopLoss"
          control={form.control}
          render={({ field }) => <TextInput label="Stop Loss *" field={field} type="number" />}
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
          render={({ field }) => (
            <TextInput label="Comment" field={field} inputProps={{ fullWidth: true, multiline: true, rows: 6 }} />
          )}
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

export default TradeForm;
