import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  userName: z.string().optional(),
  email: z.email(),
  password: z.string().min(8),
});
export type RegisterFormType = z.infer<typeof registerFormSchema>;
