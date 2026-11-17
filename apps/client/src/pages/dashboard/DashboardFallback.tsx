import ErrorIcon from "@mui/icons-material/Error";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoadingTrades from "./LoadingTrades";
import { DashboardMessageContainer } from "./styledComps";

const DashboardFallback = () => {
  return (
    <>
      <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Skeleton variant="rectangular" height={40} width={200} />
        </Stack>
      </Stack>
      <LoadingTrades />
      <DashboardMessageContainer>
        <ErrorIcon color="error" />
        <Typography variant="body1">
          An error occurred while loading the dashboard. Please refresh to try again.
        </Typography>
      </DashboardMessageContainer>
    </>
  );
};

export default DashboardFallback;
