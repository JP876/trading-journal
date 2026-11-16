import { atom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { dashboardWarningsAtom } from "../../atoms";
import WidgetContainer, { type TWidgetContainerProps } from "../WidgetContainer";
import PerformanceChart from "./PerformanceChart";

type TPerformanceProps = {
  paperProps?: TWidgetContainerProps["paperProps"];
};

const Performance = ({ paperProps }: TPerformanceProps) => {
  const withoutProfitAtom = useMemo(() => {
    return atom((get) => get(dashboardWarningsAtom).get("withoutProfit"));
  }, []);
  const withoutProfit = useAtomValue(withoutProfitAtom);

  return (
    <WidgetContainer
      title="Account Performance"
      description="See your trading P&L trend for the selected account and date range."
      warningTitle={withoutProfit?.message}
      paperProps={paperProps}
    >
      <PerformanceChart />
    </WidgetContainer>
  );
};

export default Performance;
