import { Autocomplete, TextField } from '@mui/material';

import { FormFieldType, SelectOptionType } from '@/types';

type AutocompleteInputType = {
  field: FormFieldType;
  label: string;
  options: SelectOptionType[];
};

const AutocompleteInput = ({ field, label, options }: AutocompleteInputType) => {
  return (
    <Autocomplete
      fullWidth
      options={options}
      renderInput={(params) => <TextField inputRef={field.ref} {...params} size="small" label={label} />}
      value={field.value ? options.find((option) => option.id === field.value) : null}
      onChange={(_: any, newValue: SelectOptionType | null) => {
        field.onChange(newValue?.id);
      }}
    />
  );
};

export default AutocompleteInput;
