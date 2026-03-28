import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import type { ControllerFieldState } from 'react-hook-form';

import type { AutocompleteOption, FormField } from '../../../types';

type AutocompleteInputProps = {
  field: FormField;
  fieldState: ControllerFieldState;
  label: string;
  options: AutocompleteOption[];
  helperText?: string;
};

const AutocompleteInput = ({ field, fieldState, label, options, helperText }: AutocompleteInputProps) => {
  return (
    <FormControl fullWidth size="small" error={!!fieldState.error}>
      <Autocomplete
        fullWidth
        options={options}
        groupBy={(option) => option?.groupBy || ''}
        renderInput={(params) => (
          <TextField inputRef={field.ref} {...params} size="small" label={label} error={!!fieldState.error} />
        )}
        value={field.value ? options.find((option) => option.value === field.value) : null}
        onChange={(_: any, newValue: AutocompleteOption | null) => {
          field.onChange(newValue?.value);
        }}
      />
      <FormHelperText>{!!fieldState.error ? fieldState.error.message : helperText}</FormHelperText>
    </FormControl>
  );
};

export default AutocompleteInput;
