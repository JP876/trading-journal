import { useMemo } from 'react';
import { z } from 'zod';
import { Autocomplete, FormControl, FormHelperText, TextField } from '@mui/material';
import { useStore } from '@tanstack/react-form';

import type { SelectOption } from '../../../types';
import { useFieldContext } from '../formContext';

export type AutocompleteOptions = SelectOption & { groupBy?: string };

type AutocompleteInputProps = {
  label: string;
  options: AutocompleteOptions[];
  helperText?: string;
};

const FormAutocompleteField = ({ label, options, helperText }: AutocompleteInputProps) => {
  const field = useFieldContext<string | number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  const errText = errors
    .map((err: z.ZodError<any> | string) => (typeof err === 'string' ? err : err.message))
    .join(' ');

  const value = useMemo(() => {
    if (!field.state.value) return null;
    return options.find((option) => option.value === field.state.value);
  }, [field.state.value, options]);

  return (
    <FormControl fullWidth size="small" error={!!errors.length}>
      <Autocomplete
        fullWidth
        options={options}
        groupBy={(option) => option?.groupBy || ''}
        renderInput={(params) => <TextField {...params} size="small" label={label} />}
        value={value}
        onChange={(_: any, newValue: AutocompleteOptions | null) => {
          if (newValue) field.handleChange(newValue.value);
        }}
      />
      {errText || helperText ? <FormHelperText>{errText || helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default FormAutocompleteField;
