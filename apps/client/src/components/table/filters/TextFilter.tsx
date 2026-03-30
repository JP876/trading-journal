import TextField, { type TextFieldProps } from '@mui/material/TextField';

import useFilter from '../hooks/useFilter';
import LoadingAdornment from '../LoadingAdornment';

type TextFilterProps = {
  name: string;
  label: string;
  initialValue?: string;
  isLoading?: boolean;
};

const TextFilter = ({
  name,
  label,
  initialValue,
  isLoading,
  ...rest
}: TextFilterProps & Omit<TextFieldProps, 'value' | 'onChange'>) => {
  const [filterValue, handleFilterChange, { isPending }] = useFilter({ name, initialValue: initialValue || '' });

  return (
    <TextField
      id={`${label}-filter-text-field`}
      size="small"
      fullWidth
      label={label}
      {...rest}
      value={filterValue || ''}
      onChange={(e) => handleFilterChange(e.target.value)}
      slotProps={{
        ...(rest?.slotProps || {}),
        input: {
          ...(rest?.slotProps?.input || {}),
          endAdornment: <LoadingAdornment isLoading={isPending || !!isLoading} />,
        },
      }}
    />
  );
};

export default TextFilter;
