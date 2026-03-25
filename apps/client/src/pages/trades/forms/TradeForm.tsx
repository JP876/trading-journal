import { Box, Divider, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { TradeFormSchema } from '../../../types/trade';
import { closedByOptions, defaultTradeValues, directonOptions, orderTypeOptions, resultOptions } from './consts';
import { withForm } from '../../../components/Form';
import type { Pair } from '../../../types/pair';
import type { AutocompleteOptions } from '../../../components/Form/inputs/AutocompleteField';

const TradeForm = withForm({
  defaultValues: {},
  validators: {
    onSubmit: TradeFormSchema,
  },
  render: function Render({ form }) {
    const queryClient = useQueryClient();
    const pairs = queryClient.getQueryData<Pair[]>(['pairs']);

    const pairOptions: AutocompleteOptions[] = (() => {
      if (!Array.isArray(pairs)) return [];
      return pairs.map((el) => ({ value: el.id, label: el.pair, groupBy: el.assetClass }));
    })();

    const handleSubmit = (e: React.SubmitEvent) => {
      e.preventDefault();
      form.handleSubmit();
    };

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <form.AppField name="pairId">
            {(field) => <field.Autocomplete label="Pair *" options={pairOptions} />}
          </form.AppField>
          <form.AppField name="result">
            {(field) => <field.Select label="Result *" options={resultOptions} />}
          </form.AppField>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <form.AppField name="closedBy">
            {(field) => <field.Select label="Closed by" options={closedByOptions} />}
          </form.AppField>
          <form.AppField name="closedAt">
            {(field) => <field.TextField label="Closed at" type="number" />}
          </form.AppField>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <form.AppField name="direction">
            {(field) => <field.Select label="Direction *" options={directonOptions} />}
          </form.AppField>
          <form.AppField name="orderType">
            {(field) => <field.Select label="Closed at" options={orderTypeOptions} />}
          </form.AppField>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <form.AppField name="takeProfit">
            {(field) => <field.TextField label="Take Profit" type="number" />}
          </form.AppField>
          <form.AppField name="stopLoss">
            {(field) => <field.TextField label="Stop Loss" type="number" />}
          </form.AppField>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <form.AppField name="openDate">{(field) => <field.DateTimePicker label="Take Profit" />}</form.AppField>
          <form.AppField name="closeDate">{(field) => <field.DateTimePicker label="Stop Loss" />}</form.AppField>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <form.AppField name="comment">
            {(field) => <field.TextField label="Comment" multiline rows={6} />}
          </form.AppField>
        </Stack>

        <Divider />
        <form.AppForm>
          <form.SubscribeButton>Submit</form.SubscribeButton>
        </form.AppForm>
      </Box>
    );
  },
});

export default TradeForm;
