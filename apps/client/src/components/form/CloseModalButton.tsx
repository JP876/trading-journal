import CloseIcon from '@mui/icons-material/Close';
import Button, { type ButtonProps } from '@mui/material/Button';
import { memo } from 'react';

import useModal from '../../hooks/useModal';
import { compose } from '../../lib/utils';

type TCloseModalButtonProps = ButtonProps & {
  modalId: string;
};

const CloseModalButton = ({ modalId, ...rest }: TCloseModalButtonProps) => {
  const { closeModal } = useModal();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    compose<React.MouseEvent<HTMLButtonElement>>(
      (event) => {
        closeModal(modalId);
        return event;
      },
      (event) => {
        if (rest.onClick) rest.onClick(event);
        return event;
      }
    )(event);
  };

  return (
    <Button variant="outlined" size="small" startIcon={<CloseIcon />} {...rest} onClick={handleClick}>
      Cancel
    </Button>
  );
};

export default memo(CloseModalButton);
