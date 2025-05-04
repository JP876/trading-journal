import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

import useAppStore from '@/store';
import { editLoggedInUser } from '@/api/user';
import { userFormSchema, UserFormSchema } from '../types';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EditUserForm = () => {
  const queryClient = useQueryClient();
  const userData = useAppStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: editLoggedInUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('The account has been updated successfully.');
    },
  });

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userName: userData?.userName,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      userSettings: {
        defaultStopLoss: userData?.userSettings?.defaultStopLoss,
        defaultTakeProfit: userData?.userSettings?.defaultTakeProfit,
      },
    },
  });

  const onSubmit = (data: UserFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-6">
        <FormField
          name="userName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Firstname</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Lastname</FormLabel>
              <Input {...field} />
            </FormItem>
          )}
        />
        <div className="gap-6 flex justify-evenly items-center">
          <FormField
            name="userSettings.defaultStopLoss"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Default Stop Loss</FormLabel>
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
            name="userSettings.defaultTakeProfit"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Default Take Profit</FormLabel>
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
        </div>

        <div className=" flex justify-end items-center">
          <Button className="mt-4" type="submit">
            <Check /> Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
