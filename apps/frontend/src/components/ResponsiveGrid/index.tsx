import { Box, BoxProps, styled } from '@mui/material';

const getFieldMaxWidth = (columns: number, layoutGap: string | number): string => {
  let gapCount = `calc(${columns} - 1)`;
  let totalGapWidth = `calc(${gapCount} * ${layoutGap})`;
  let maxWidth = `calc((100% - ${totalGapWidth}) / ${columns})`;

  return maxWidth;
};

interface IResponsiveGridProps extends BoxProps {
  maxItemsPerRow?: number;
  minWidthOfItem?: string;
  gridGap?: number | string;
}

const ResponsiveGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxItemsPerRow' && prop !== 'minWidthOfItem' && prop !== 'gridGap',
})<IResponsiveGridProps>(({ theme, maxItemsPerRow, minWidthOfItem, gridGap }) => ({
  display: 'grid',
  gap: gridGap || theme.spacing(2),
  gridTemplateColumns: `repeat(auto-fill, minmax(max(${minWidthOfItem || '10rem'}, ${getFieldMaxWidth(
    maxItemsPerRow || 4,
    gridGap || theme.spacing(2)
  )}), 1fr))`,
}));

export default ResponsiveGrid;
