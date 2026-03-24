import { z } from 'zod';

export const RegisterFormSchema = z.object({
  name: z.string().nonempty('Please enter your username.'),
  email: z.email('The email address is badly formatted.'),
  password: z.string().min(8, 'Your password must have 8 characters or more.'),
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
  email: z.email('The email address is badly formatted.'),
  password: z.string().min(8, 'Your password must have 8 characters or more.'),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
