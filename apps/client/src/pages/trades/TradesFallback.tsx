import ErrorIcon from "@mui/icons-material/Error";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { FallbackMessageContainer } from "../../components/styledComps";

const TradesFallback = () => {
  return (
    <Stack>
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          rowGap: 2,
        }}
      >
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Typography variant="h4">Trades</Typography>

          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Stack>
        </Stack>

        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Skeleton variant="rounded" width={240} height={40} />
          <Skeleton variant="rounded" width={240} height={40} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
      </Stack>

      <Stack sx={{ width: "100%", height: "70vh" }}>
        <Skeleton variant="rounded" width="100%" height="100%" />
        <FallbackMessageContainer>
          <ErrorIcon color="error" />
          <Typography variant="body1">The trades page failed to load. Refresh the page to try again.</Typography>
        </FallbackMessageContainer>
      </Stack>
    </Stack>
  );
};

export default TradesFallback;
