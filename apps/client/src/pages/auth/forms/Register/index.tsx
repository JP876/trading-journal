import Button from '@mui/material/Button';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { registerUser } from '../../../../api/auth';
import { RegisterFormSchema, type RegisterFormData } from '../../../../types/auth';
import FormMain from '../../../../components/form/FormMain';
import TextInput from '../../../../components/form/TextInput';
import PasswordInput from '../../../../components/form/PasswordInput';

const UsernameStartAdornment = () => (
  <InputAdornment position="start">
    <PersonIcon fontSize="small" />
  </InputAdornment>
);

const EmailStartAdornment = () => (
  <InputAdornment position="start">
    <EmailIcon fontSize="small" />
  </InputAdornment>
);

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
        name="name"
        control={form.control}
        render={(props) => (
          <TextInput
            {...props}
            label="Username *"
            inputProps={{
              slotProps: {
                input: { startAdornment: <UsernameStartAdornment /> },
              },
            }}
          />
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={(props) => (
          <TextInput
            {...props}
            label="Email *"
            inputProps={{
              slotProps: {
                input: { startAdornment: <EmailStartAdornment /> },
              },
            }}
          />
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={(props) => <PasswordInput {...props} label="Password *" />}
      />
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
