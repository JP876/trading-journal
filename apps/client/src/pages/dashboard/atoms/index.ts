import { atom } from "jotai";

import type { TDashboardWarning, TDashboardWarningValue, TWarningKeys } from "../types";

export const dashboardWarningsAtom = atom<TDashboardWarning>(new Map());

export const updateDashboardWarningAtom = atom(
  null,
  (get, set, value: [key: TWarningKeys, warning: TDashboardWarningValue]) => {
    const newValue = new Map(get(dashboardWarningsAtom));
    set(dashboardWarningsAtom, newValue.set(...value));
  },
);

export const foundTradesWithoutProfitAtom = atom((get) => {
  return get(dashboardWarningsAtom).get("foundTradesWithoutProfit");
});
