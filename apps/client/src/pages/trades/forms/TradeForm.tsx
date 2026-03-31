import Stack from '@mui/material/Stack';
import { Controller, Watch, type UseFormReturn } from 'react-hook-form';

import type { TradeFormSchemaType } from '../../../types/trade';
import FormMain from '../../../components/form/FormMain';
import TextInput from '../../../components/form/TextInput';
import SelectInput from '../../../components/form/SelectInput';
import DateTimeInput from '../../../components/form/DateTimeInput';
import AutocompleteInput from '../../../components/form/AutocompleteInput';
import { closedByOptions, directonOptions, orderTypeOptions, resultOptions } from '../consts';
import usePairOptions from '../hooks/usePairOptions';
import SubmitButton from '../../../components/form/SubmitButton';

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
      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="pairId"
          control={form.control}
          render={(props) => <AutocompleteInput {...props} options={pairOptions} label="Pair *" />}
        />
        <Controller
          name="result"
          control={form.control}
          render={(props) => <SelectInput options={resultOptions} label="Result *" {...props} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="direction"
          control={form.control}
          render={(props) => <SelectInput options={directonOptions} label="Direction *" {...props} />}
        />
        <Controller
          name="orderType"
          control={form.control}
          render={(props) => <SelectInput options={orderTypeOptions} label="Order type" {...props} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="closedBy"
          control={form.control}
          render={(props) => <SelectInput options={closedByOptions} label="Closed by" {...props} />}
        />
        <Controller
          name="closedAt"
          control={form.control}
          render={(props) => (
            <Watch
              control={form.control}
              name={['closedBy']}
              render={([closedBy]) => (
                <TextInput label="Closed at" {...props} type="number" inputProps={{ disabled: closedBy === 'tp/sl' }} />
              )}
            />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="takeProfit"
          control={form.control}
          render={(props) => <TextInput label="Take Profit *" {...props} inputProps={{ type: 'number' }} />}
        />
        <Controller
          name="stopLoss"
          control={form.control}
          render={(props) => <TextInput label="Stop Loss *" {...props} inputProps={{ type: 'number' }} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap={4}>
        <Controller
          name="openDate"
          control={form.control}
          render={(props) => <DateTimeInput label="Open Date" {...props} />}
        />
        <Controller
          name="closeDate"
          control={form.control}
          render={(props) => <DateTimeInput label="Close Date" {...props} />}
        />
      </Stack>

      <Stack direction="row" alignItems="center">
        <Controller
          name="comment"
          control={form.control}
          render={(props) => (
            <TextInput label="Comment" {...props} inputProps={{ fullWidth: true, multiline: true, rows: 6 }} />
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end">
        <SubmitButton loading={isLoading} />
      </Stack>
    </FormMain>
  );
};

export default TradeForm;
