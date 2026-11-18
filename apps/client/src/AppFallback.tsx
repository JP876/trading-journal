import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const FallbackContainer = styled(Paper)(({ theme }) => ({
  width: "clamp(24rem, 40vw, 32rem)",
  padding: theme.spacing(4),
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: theme.zIndex.modal + 1,
  boxShadow: theme.shadows[1],
}));

const AppFallback = () => {
  return (
    <FallbackContainer>
      <Stack sx={{ flexDirection: "column", alignItems: "center", gap: 2 }}>
        <ReportProblemIcon fontSize="large" color="error" />
        <Typography variant="subtitle1" sx={{ textWrap: "balance", textAlign: "center" }}>
          We're having trouble displaying this page right now. Refresh the page, or come back and try again shortly.
        </Typography>
      </Stack>
    </FallbackContainer>
  );
};

export default AppFallback;
