import { styled } from '@mui/material';
import Typography, { type TypographyProps } from '@mui/material/Typography';

export type ClampedTextProps = TypographyProps<'span', { maxRows?: number }>;

export const ClampedText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'maxRows',
})<ClampedTextProps>(({ maxRows = 1 }) => ({
  whiteSpace: 'wrap',
  wordBreak: 'break-all',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: maxRows,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
