import { ReactNode } from 'react';
import { Box, type BoxProps } from '@mui/material';
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form';

type FormMainProps<TFieldValues extends FieldValues> = {
  onSubmit: (data: TFieldValues) => void;
  form: UseFormReturn<TFieldValues, any, TFieldValues>;
  children: ReactNode;
  boxProps?: BoxProps<'form'>;
};

const FormMain = <T extends FieldValues>({ form, onSubmit, boxProps, children }: FormMainProps<T>) => {
  return (
    <FormProvider {...form}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, ...(boxProps?.sx || {}) }}
        {...(boxProps || {})}
        component="form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </Box>
    </FormProvider>
  );
};

export default FormMain;
