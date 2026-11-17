import Skeleton from "@mui/material/Skeleton";

import { WidgetsContainer } from "./styledComps";

const LoadingTrades = () => {
  return (
    <WidgetsContainer>
      <Skeleton variant="rectangular" sx={{ gridArea: "stats", height: "100%", width: "100%" }} />
      <Skeleton variant="rectangular" sx={{ gridArea: "performance", height: "100%", width: "100%" }} />
      <Skeleton variant="rectangular" sx={{ gridArea: "profitable", height: "100%", width: "100%" }} />
      <Skeleton variant="rectangular" sx={{ gridArea: "consecutive", height: "100%", width: "100%" }} />
      <Skeleton variant="rectangular" sx={{ gridArea: "durations", height: "100%", width: "100%" }} />
    </WidgetsContainer>
  );
};

export default LoadingTrades;
