import * as v from 'valibot';

export const RegisterFormSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Please enter your username.')),
  email: v.pipe(v.string(), v.nonEmpty('Please enter your email.'), v.email('The email address is badly formatted.')),
  password: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your password.'),
    v.minLength(8, 'Your password must have 8 characters or more.')
  ),
});

export type RegisterFormData = v.InferOutput<typeof RegisterFormSchema>;

export const LoginFormSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty('Please enter your email.'), v.email('The email address is badly formatted.')),
  password: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your password.'),
    v.minLength(8, 'Your password must have 8 characters or more.')
  ),
});

export type LoginFormData = v.InferOutput<typeof LoginFormSchema>;
