import { atom } from "jotai";

type TDashboardWarning = {
  message: string;
};

export const dashboardWarningsAtom = atom<Map<string, TDashboardWarning>>(new Map());

export const updateDashboardWarningAtom = atom(null, (get, set, value: [key: string, warning: TDashboardWarning]) => {
  const prevValue = get(dashboardWarningsAtom);
  set(dashboardWarningsAtom, prevValue.set(...value));
});
