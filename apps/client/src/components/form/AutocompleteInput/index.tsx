import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import type { FormField, SelectOption } from '../../../types';

export type AutocompleteOption = SelectOption & { groupBy?: string };

type AutocompleteInputProps = {
  field: FormField;
  label: string;
  options: AutocompleteOption[];
};

const AutocompleteInput = ({ field, label, options }: AutocompleteInputProps) => {
  return (
    <Autocomplete
      fullWidth
      options={options}
      groupBy={(option) => option?.groupBy || ''}
      renderInput={(params) => <TextField inputRef={field.ref} {...params} size="small" label={label} />}
      value={field.value ? options.find((option) => option.value === field.value) : null}
      onChange={(_: any, newValue: AutocompleteOption | null) => {
        field.onChange(newValue?.value);
      }}
    />
  );
};

export default AutocompleteInput;
