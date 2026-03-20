import { useMutation } from '@tanstack/react-query';
import { Box, Divider } from '@mui/material';

import { loginUser } from '../../../../api/auth';
import { useAppForm } from '../../../Form';
import { LoginFormSchema } from '../../../../types/auth';

const LoginForm = () => {
  const mutation = useMutation({ mutationFn: loginUser });

  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onSubmit: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 2 }}>
      <form.AppField name="email">{(field) => <field.TextField label="Email *" />}</form.AppField>
      <form.AppField name="password">{(field) => <field.TextField label="Password *" type="password" />}</form.AppField>
      <Divider />
      <form.AppForm>
        <form.SubscribeButton loading={mutation.isPending}>Submit</form.SubscribeButton>
      </form.AppForm>
    </Box>
  );
};

export default LoginForm;
