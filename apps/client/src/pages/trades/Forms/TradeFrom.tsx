import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Check, RotateCcw, Trash2 } from 'lucide-react';

import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { DateTimePicker } from '@/components/ui/formInputs/DateTimePicker';
import SelectInput from '@/components/ui/formInputs/SelectInput';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ComboboxInput from '@/components/ui/formInputs/ComboboxInput';
import { ISelectItem } from '@/components/ui/formInputs/types';
import { EditTradeFormSchemaType, FilesType, TradeFormSchemaType } from '../types';
import LoadingButton from '@/components/ui/loading-button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const directionItems = [
  { label: 'BUY', value: 'buy' },
  { label: 'SELL', value: 'sell' },
];

const resultItems = [
  { label: 'WIN', value: 'win' },
  { label: 'BE', value: 'be' },
  { label: 'LOSS', value: 'loss' },
];

const pairItems: ISelectItem[] = [
  { label: 'EUR/USD', value: 'EUR/USD' },
  { label: 'USD/JPY', value: 'USD/JPY' },
  { label: 'EUR/JPY', value: 'EUR/JPY' },
  { label: 'AUD/JPY', value: 'AUD/JPY' },
  { label: 'GBP/USD', value: 'GBP/USD' },
  { label: 'AUD/USD', value: 'AUD/USD' },
  { label: 'USD/CAD', value: 'USD/CAD' },
  { label: 'USD/CHF', value: 'USD/CHF' },
  { label: 'NZD/USD', value: 'NZD/USD' },
  { label: 'EUR/GBP', value: 'EUR/GBP' },
];

type FormSchema = TradeFormSchemaType | EditTradeFormSchemaType;
interface ITradeForm {
  form: UseFormReturn<FormSchema, any, FormSchema>;
  onSubmit: (data: FormSchema) => void;
  loading?: boolean;
  addedFiles?: FilesType[];
}

const AddedTradeFiles = ({
  field,
  addedFiles,
}: {
  field: ControllerRenderProps<EditTradeFormSchemaType, 'deleteFiles'>;
  addedFiles?: FilesType[];
}) => {
  const handleDelete = (id: string) => {
    field.onChange([...new Set([...(field.value || []), id])]);
  };

  const handleReset = (id: string) => {
    field.onChange((field.value || []).filter((el) => el !== id));
  };

  if (!Array.isArray(addedFiles) || addedFiles?.length === 0) return <></>;

  return (
    <FormItem className="flex flex-col gap-2">
      <FormLabel>Added Files</FormLabel>

      {addedFiles.map((file) => {
        const isDeleted = !!field.value?.includes(file?.id);

        return (
          <div
            key={file.id}
            className={cn('flex justify-between items-center border-2 p-2 rounded-md', isDeleted && ' bg-gray-100')}
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage className={cn(isDeleted && 'opacity-50')} src={file.url} />
              </Avatar>
              <p className={cn(isDeleted && 'opacity-50')}>{file.name}</p>
            </div>

            <div className="flex items-center gap-1">
              {isDeleted ? (
                <Button type="button" variant="ghost" onClick={() => handleReset(file.id)}>
                  <RotateCcw />
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={() => handleDelete(file.id)}>
                  <Trash2 className="text-destructive" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </FormItem>
  );
};

const TradeFrom = ({ form, onSubmit, loading, addedFiles }: ITradeForm) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
        <div className="mb-6 flex items-center justify-evenly gap-6">
          <FormField
            name="pair"
            control={form.control}
            render={({ field }) => (
              <ComboboxInput
                label="Pair *"
                value={field.value}
                onChange={field.onChange}
                ref={field.ref}
                items={pairItems}
              />
            )}
          />
          <FormField
            name={form.register('direction').name}
            control={form.control}
            render={({ field }) => (
              <SelectInput
                label="Direction *"
                value={field.value}
                onChange={field.onChange}
                ref={field.ref}
                items={directionItems}
              />
            )}
          />
          <FormField
            name={form.register('result').name}
            control={form.control}
            render={({ field }) => (
              <SelectInput
                label="Result *"
                value={field.value}
                onChange={field.onChange}
                ref={field.ref}
                items={resultItems}
              />
            )}
          />
        </div>

        <div className="mb-6 flex justify-evenly items-center gap-6">
          <FormField
            name="stopLoss"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stop Loss *</FormLabel>
                <Input
                  type="number"
                  step=".01"
                  min={0}
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormItem>
            )}
          />
          <FormField
            name="takeProfit"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Take Profit *</FormLabel>
                <Input
                  type="number"
                  step=".01"
                  min=".01"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormItem>
            )}
          />
          <FormField
            name="pl"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Profit/loss</FormLabel>
                <Input
                  type="number"
                  step=".01"
                  pattern="-?[0-9]+"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(+e.target.value)}
                />
              </FormItem>
            )}
          />
        </div>

        <div className="mb-6 w-full flex items-center justify-between gap-6">
          <FormField
            name="openDate"
            control={form.control}
            render={({ field }) => <DateTimePicker label="Open Date" {...field} popoverRootProps={{ modal: true }} />}
          />
          <FormField
            name="closeDate"
            control={form.control}
            render={({ field }) => <DateTimePicker label="Close Date" {...field} popoverRootProps={{ modal: true }} />}
          />
        </div>

        <div className="mb-6">
          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <Textarea {...field} />
              </FormItem>
            )}
          />
        </div>

        {Array.isArray(addedFiles) && addedFiles?.length !== 0 ? (
          <div className="mb-4 ">
            <FormField
              name="deleteFiles"
              control={form.control}
              render={({ field }) => <AddedTradeFiles field={field} addedFiles={addedFiles} />}
            />
          </div>
        ) : null}

        <FormField
          name="files"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Files</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => field.onChange([...(e.target.files || [])])}
              />
            </FormItem>
          )}
        />

        <div className=" flex justify-end items-center">
          <LoadingButton loading={loading} type="submit" className="mt-4">
            <Check /> Submit
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default TradeFrom;
