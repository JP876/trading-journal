import { memo } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import useClearFilters from './hooks/useClearFilters';
import { IconButton, Tooltip } from '@mui/material';

const ResetFilters = () => {
  const [handleClick, { isPending }] = useClearFilters({});

  return (
    <Tooltip arrow title="Reset filters" disableInteractive>
      <span>
        <IconButton size="small" onClick={() => handleClick()} loading={isPending}>
          <HighlightOffIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default memo(ResetFilters);
