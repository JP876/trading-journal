export type TWarningKeys = "foundTradesWithoutProfit" | "";

export type TDashboardWarningValue = {
  message: string;
};

export type TDashboardWarning = Map<TWarningKeys, TDashboardWarningValue>;
