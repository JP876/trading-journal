import Box from "@mui/material/Box";
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
