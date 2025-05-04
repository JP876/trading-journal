import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { loginFormSchema, LoginFormType } from '../../types';
import { loginUser } from '@/api/auth';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ErrorResponse } from '@/types';

const LoginForm = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate('/trades', { replace: true });
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

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormType) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2 grid gap-2 ">
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
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
