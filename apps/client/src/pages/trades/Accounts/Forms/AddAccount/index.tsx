import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

import { addAccount } from '@/api/accounts';
import useAppStore from '@/store';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AccountDialogListIds, accountFormSchema, AccountFormSchemaType } from '../../types';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const AddAccountForm = () => {
  const queryClient = useQueryClient();
  const closeModal = useAppStore((state) => state.closeModal);

  const mutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      closeModal(AccountDialogListIds.ADD_ACCOUNT);
      toast.success('The account has been added successfully');
    },
  });

  const form = useForm<AccountFormSchemaType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: { title: '', description: '', isMain: false },
  });

  const onSubmit = (data: AccountFormSchemaType) => {
    mutation.mutate({ ...data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-6">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title *</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />
        <FormField
          name="isMain"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is account main</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <Textarea {...field} />
            </FormItem>
          )}
        />

        <div className=" flex justify-end items-center">
          <Button className="mt-4" type="submit">
            <Check /> Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddAccountForm;
