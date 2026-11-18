import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Button, styled } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

const NotFoundContainer = styled(Paper)(({ theme }) => ({
  width: "clamp(24rem, 40vw, 32rem)",
  padding: theme.spacing(4),
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: theme.zIndex.modal + 1,
  boxShadow: theme.shadows[10],
}));

const NotFount = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard", { viewTransition: true, replace: true });
  };

  return (
    <NotFoundContainer>
      <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 2, mb: 2 }}>
        <SearchOffIcon fontSize="large" color="warning" />
        <Typography variant="h6">Page Not Found</Typography>
      </Stack>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Looks like the link you followed expired, or maybe it never existed. Try starting over.
      </Typography>
      <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        <Button color="warning" size="small" variant="outlined" onClick={handleClick}>
          Go to Dashboard
        </Button>
      </Stack>
    </NotFoundContainer>
  );
};

export default NotFount;
