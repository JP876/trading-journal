import { z } from 'zod';

export const RegisterFormSchema = z.object({
  name: z.string().nonempty('Please enter your username.'),
  email: z.email('The email address is badly formatted.').nonempty('Please enter your email.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain at least one letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/\d/, 'Must contain at least one number')
    .regex(/[\W_]/, 'Must contain at least one special character')
    .nonempty('Please enter your password.'),
});

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
  email: z.email('The email address is badly formatted.').nonempty('Please enter your email.'),
  password: z.string().min(8, 'Password must be at least 8 characters').nonempty('Please enter your password.'),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
