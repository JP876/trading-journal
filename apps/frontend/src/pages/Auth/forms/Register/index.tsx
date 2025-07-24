import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { Button, Divider } from '@mui/material';

import { registerUser } from '@/api/auth';
import useAppStore from '@/store';
import { registerFormSchema, RegisterFormType } from '@/types/auth';
import FormMain from '@/components/form/FormMain';
import TextInput from '@/components/form/TextInput';

const RegisterForm = () => {
  const openToast = useAppStore((state) => state.openToast);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      openToast({ severity: 'success', message: 'The registration request has been successfully submitted.' });
    },
  });

  const form = useForm<RegisterFormType>({
    resolver: standardSchemaResolver(registerFormSchema),
    defaultValues: { userName: '', email: '', password: '' },
  });

  const onSubmit = (data: RegisterFormType) => {
    const formData = { ...data };
    if (!data.userName) delete formData.userName;

    mutation.mutate(formData);
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
        name="userName"
        control={form.control}
        render={({ field }) => <TextInput field={field} label="Username" />}
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
