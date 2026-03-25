import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { registerUser } from '../../../../api/auth';
import { RegisterFormSchema, type RegisterFormData } from '../../../../types/auth';
import FormMain from '../../../../components/form/FormMain';
import TextInput from '../../../../components/form/TextInput';

const RegisterForm = () => {
  const mutation = useMutation({ mutationFn: registerUser });

  const form = useForm<RegisterFormData>({
    resolver: standardSchemaResolver(RegisterFormSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const formData = { ...data };
    await mutation.mutateAsync(formData);
  };

  return (
    <FormMain form={form} onSubmit={onSubmit}>
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => <TextInput field={field} label="Email *" />}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field }) => <TextInput field={field} type="password" label="Password *" />}
      />
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => <TextInput field={field} label="Username *" />}
      />
      <Divider />
      <Button
        loading={mutation.isPending}
        startIcon={<AssignmentAddIcon />}
        size="small"
        variant="contained"
        type="submit"
      >
        Sign Up
      </Button>
    </FormMain>
  );
};

export default RegisterForm;
