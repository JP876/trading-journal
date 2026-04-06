import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import useClearFilters from './hooks/useClearFilters';

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
