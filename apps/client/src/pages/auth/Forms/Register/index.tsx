import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { registerUser } from '@/api/auth';
import { ErrorResponse } from '@/types';
import { registerFormSchema, RegisterFormType } from '../../types';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RegisterForm = () => {
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('The registration request has been successfully submitted.');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data.message;
      if (message) {
        if (Array.isArray(message) && message.length > 0) {
          message.map((m) => toast.error(m));
        } else {
          toast.error(message);
        }
      }
    },
  });

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { userName: '', email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormType) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2 grid gap-2 ">
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
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email *</FormLabel>
              <Input type="email" {...field} />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password *</FormLabel>
              <Input type="password" {...field} />
            </FormItem>
          )}
        />

        <Button className="mt-4" type="submit" disabled={mutation.isPending}>
          Register
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
