import { styled } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography, { type TypographyProps } from "@mui/material/Typography";

export type ClampedTextProps = TypographyProps<"span", { maxRows?: number }>;

export const ClampedText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "maxRows",
})<ClampedTextProps>(({ maxRows = 1 }) => ({
  whiteSpace: "wrap",
  wordBreak: "break-all",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: maxRows,
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const VisuallyHiddenInput = styled("input")({
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const FallbackMessageContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: theme.spacing(2),
  position: "fixed",
  zIndex: theme.zIndex.modal - 1,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: theme.spacing(2),
  maxWidth: "min(28rem, 50vw)",
  backgroundColor: theme.palette.background.paper,

  "& svg": {
    width: "2rem",
    height: "2rem",
  },

  "& p": {
    textWrap: "pretty",
  },
}));
