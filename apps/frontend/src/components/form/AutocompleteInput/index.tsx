import { Autocomplete, TextField } from '@mui/material';

import { FormFieldType, SelectOptionType } from '@/types';

export type AutocompleteOptions = SelectOptionType & { groupBy?: string };

type AutocompleteInputType = {
  field: FormFieldType;
  label: string;
  options: AutocompleteOptions[];
};

const AutocompleteInput = ({ field, label, options }: AutocompleteInputType) => {
  return (
    <Autocomplete
      fullWidth
      options={options}
      groupBy={(option) => option?.groupBy || ''}
      renderInput={(params) => <TextField inputRef={field.ref} {...params} size="small" label={label} />}
      value={field.value ? options.find((option) => option.id === field.value) : null}
      onChange={(_: any, newValue: AutocompleteOptions | null) => {
        field.onChange(newValue?.id);
      }}
    />
  );
};

export default AutocompleteInput;
