import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React from 'react';

import ClampedTextContainer from '../../../components/ClampedTextContainer';

const WidgetContainerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

export type TWidgetContainerProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  renderActions?: () => React.ReactNode;
};

const WidgetContainer = ({ title, description, renderActions, children }: TWidgetContainerProps) => {
  return (
    <WidgetContainerPaper>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
        <Stack>
          <Typography variant="h5">{title}</Typography>
          <ClampedTextContainer variant="caption" maxRows={1}>
            {description}
          </ClampedTextContainer>
        </Stack>
        {renderActions ? renderActions() : null}
      </Stack>

      {children}
    </WidgetContainerPaper>
  );
};

export default WidgetContainer;
