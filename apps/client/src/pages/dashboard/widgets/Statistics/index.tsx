import WidgetContainer, { type TWidgetContainerProps } from "../WidgetContainer";
import Summary from "./Summary";

type TStatisticsProps = {
  paperProps?: TWidgetContainerProps["paperProps"];
};

const Statistics = ({ paperProps }: TStatisticsProps) => {
  return (
    <WidgetContainer
      title="Trading Summary"
      description="Get an overview of your results, including win rate, average P&L, and trade count."
      paperProps={paperProps}
    >
      <Summary />
    </WidgetContainer>
  );
};

export default Statistics;
