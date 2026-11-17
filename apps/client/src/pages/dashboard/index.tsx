import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSuspenseQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";

import { getTrades } from "../../api/trades";
import JotaiProvider from "../../components/JotaiProvider";
import { QueryKey } from "../../enums";
import TradingSessionSelect from "../trades/TradingSessionSelect";
import useResetWidgets from "./hooks/useResetWidgets";
import LoadingTrades from "./LoadingTrades";
import { WidgetsContainer } from "./styledComps";
import TradesNotFound from "./TradesNotFound";

const ConsecutiveTrades = lazy(() => import("./widgets/ConsecutiveTrades"));
const Performance = lazy(() => import("./widgets/Performance"));
const ProfitablePairs = lazy(() => import("./widgets/ProfitablePairs"));
const Statistics = lazy(() => import("./widgets/Statistics"));
const TradeDurations = lazy(() => import("./widgets/TradeDurations"));

const DashboardHeader = () => {
  const [handleReset] = useResetWidgets();

  return (
    <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <TradingSessionSelect onSettled={handleReset} />
      </Stack>
    </Stack>
  );
};

const DashboardContent = () => {
  const tradesQuery = useSuspenseQuery({
    queryKey: [QueryKey.TRADES, "closeDate", "desc"],
    queryFn: () => getTrades({ sortBy: "closeDate", direction: "desc" }),
  });

  if (tradesQuery.isLoading) return <LoadingTrades />;
  if (!tradesQuery.isFetched) return null;

  let hasTrades = Array.isArray(tradesQuery.data?.results) && tradesQuery.data.results.length > 0;
  if (!hasTrades) {
    return (
      <>
        <LoadingTrades />
        <TradesNotFound />
      </>
    );
  }

  return (
    <WidgetsContainer>
      <Statistics paperProps={{ sx: { gridArea: "stats", overflow: "auto" } }} />
      <Performance paperProps={{ sx: { gridArea: "performance" } }} />
      <ProfitablePairs paperProps={{ sx: { gridArea: "profitable" } }} />
      <ConsecutiveTrades paperProps={{ sx: { gridArea: "consecutive" } }} />
      <TradeDurations paperProps={{ sx: { gridArea: "durations" } }} />
    </WidgetsContainer>
  );
};

const DashboardMain = () => {
  return (
    <JotaiProvider>
      <DashboardHeader />
      <Suspense fallback={<LoadingTrades />}>
        <DashboardContent />
      </Suspense>
    </JotaiProvider>
  );
};

export default DashboardMain;
