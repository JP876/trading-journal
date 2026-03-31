import Button, { type ButtonProps } from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';

const SubmitButton = ({ ...rest }: ButtonProps) => {
  return (
    <Button startIcon={<CheckIcon />} size="small" variant="contained" type="submit" {...rest}>
      Confirm
    </Button>
  );
};

export default SubmitButton;
