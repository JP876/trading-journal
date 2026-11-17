import ErrorIcon from "@mui/icons-material/Error";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { FallbackMessageContainer } from "../../../components/styledComps";
import LoginFormFallback from "./LoginFormFallback";

const AuthPageFallback = () => {
  return (
    <>
      <Stack sx={[{ height: "100vh", justifyContent: "center", alignItems: "center" }]} direction="row">
        <Paper sx={{ width: "clamp(24rem, 40vw, 30rem)", p: 4, gap: 4, display: "flex", flexDirection: "column" }}>
          <Stack sx={[{ alignItems: "center", flexDirection: "row", justifyContent: "center" }]}>
            <Skeleton variant="rounded" width="100%" height={90} />
          </Stack>
          <Box sx={() => ({ display: "grid", gridTemplateColumns: "1fr", gap: 2 })}>
            <Skeleton variant="rounded" width="100%" height={32} />
          </Box>
          <LoginFormFallback />
          <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Skeleton variant="text" width="50%" height={20} sx={{ mt: -2 }} />
          </Stack>
        </Paper>
      </Stack>

      <FallbackMessageContainer>
        <ErrorIcon color="error" />
        <Typography variant="body1">An error occurred while loading the page. Please refresh to try again.</Typography>
      </FallbackMessageContainer>
    </>
  );
};

export default AuthPageFallback;
