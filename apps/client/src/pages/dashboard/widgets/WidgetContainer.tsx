import Paper, { type PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React from 'react';

import ClampedTextContainer from '../../../components/ClampedTextContainer';

const WidgetContainerPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',

  '& > div:last-child': {
    padding: theme.spacing(2),
  },
}));

const WidgetContainerHeader = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: theme.zIndex.appBar,
  gap: theme.spacing(2),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

export type TWidgetContainerProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  renderActions?: () => React.ReactNode;
  paperProps?: PaperProps;
};

const WidgetContainer = ({ title, description, renderActions, paperProps, children }: TWidgetContainerProps) => {
  return (
    <WidgetContainerPaper {...paperProps}>
      <WidgetContainerHeader direction="row" alignItems="center" justifyContent="space-between">
        <Stack>
          <Typography variant="h5">{title}</Typography>
          <ClampedTextContainer variant="caption" maxRows={1}>
            {description}
          </ClampedTextContainer>
        </Stack>
        {renderActions ? renderActions() : null}
      </WidgetContainerHeader>

      {children}
    </WidgetContainerPaper>
  );
};

export default WidgetContainer;
