import { lazy } from 'react';
import { createFormHook } from '@tanstack/react-form';
import { Button, type ButtonProps } from '@mui/material';

import { fieldContext, formContext, useFormContext } from './formContext';
import getIcon from '../getIcon';

const TextField = lazy(() => import('./inputs/TextField'));
const Select = lazy(() => import('./inputs/SelectField'));
const Autocomplete = lazy(() => import('./inputs/AutocompleteField'));
const DateTimePicker = lazy(() => import('./inputs/DateTimeField'));

const SubscribeButton = ({ ...rest }: ButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting]}>
      {([isSubmitting]) => (
        <Button
          size="small"
          variant="contained"
          startIcon={getIcon('check', { fontSize: 'small' })}
          type="submit"
          {...rest}
          // disabled={canSubmit || rest.disabled}
          loading={isSubmitting || rest?.loading}
        />
      )}
    </form.Subscribe>
  );
};

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    Autocomplete,
    DateTimePicker,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
