import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

export const WidgetsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(4),
  gridTemplateColumns: "2fr 3fr 3fr",
  gridAutoRows: "clamp(20rem, 32vw, 24rem)",
  gridTemplateAreas: `
    "stats performance profitable"
    "stats consecutive durations"
  `,

  [theme.breakpoints.down("xl")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
    gridTemplateAreas: `
      "stats performance"
      "stats durations"
      "consecutive profitable"
    `,
  },

  [theme.breakpoints.down("md")]: {
    gap: theme.spacing(2),
    gridTemplateColumns: "1fr",
    gridTemplateAreas: `
      "stats"
      "performance"
      "durations"
      "consecutive"
      "profitable"
    `,
  },
}));

export const DashboardMessageContainer = styled(Stack)(({ theme }) => ({
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
