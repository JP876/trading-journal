import { useAtomValue } from "jotai";

import { foundTradesWithoutProfitAtom } from "../../atoms";
import WidgetContainer, { type TWidgetContainerProps } from "../WidgetContainer";
import PerformanceChart from "./PerformanceChart";

type TPerformanceProps = {
  paperProps?: TWidgetContainerProps["paperProps"];
};

const Performance = ({ paperProps }: TPerformanceProps) => {
  const foundTradesWithoutProfit = useAtomValue(foundTradesWithoutProfitAtom);

  return (
    <WidgetContainer
      title="Account Performance"
      description="See your trading P&L trend for the selected account and date range."
      warningTitle={foundTradesWithoutProfit?.message}
      paperProps={paperProps}
    >
      <PerformanceChart />
    </WidgetContainer>
  );
};

export default Performance;
