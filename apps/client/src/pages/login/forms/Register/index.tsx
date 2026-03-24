import { Box, Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { registerUser } from '../../../../api/auth';
import { useAppForm } from '../../../../components/Form';
import { RegisterFormSchema } from '../../../../types/auth';

const RegisterForm = () => {
  const mutation = useMutation({ mutationFn: registerUser });

  const form = useAppForm({
    defaultValues: { name: '', email: '', password: '' },
    validators: {
      onSubmit: RegisterFormSchema,
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
      <form.AppField name="name">{(field) => <field.TextField label="Username *" />}</form.AppField>
      <form.AppField name="email">{(field) => <field.TextField label="Email *" />}</form.AppField>
      <form.AppField name="password">{(field) => <field.TextField label="Password *" type="password" />}</form.AppField>
      <Divider />
      <form.AppForm>
        <form.SubscribeButton loading={mutation.isPending}>Submit</form.SubscribeButton>
      </form.AppForm>
    </Box>
  );
};

export default RegisterForm;
