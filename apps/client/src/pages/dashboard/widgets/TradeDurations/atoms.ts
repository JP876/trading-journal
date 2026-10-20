import { atom, createStore } from 'jotai';

export const periodsAtom = atom<number[] | null>(null);
export const periodsHistoryAtom = atom<number[][]>([]);
export const periodsCountAtom = atom<string>('10');

export const tradeDurationsChartStore = createStore();

tradeDurationsChartStore.set(periodsAtom, null);
tradeDurationsChartStore.set(periodsCountAtom, '10');
tradeDurationsChartStore.set(periodsHistoryAtom, []);

export const resetStoreAtom = atom(null, (_, set) => {
  set(periodsAtom, null);
  set(periodsHistoryAtom, []);
  set(periodsCountAtom, '10');
});

export const updatePeriodsAtom = atom(null, (get, set, value: number[]) => {
  let prevPeriod = get(periodsAtom);
  if (Array.isArray(prevPeriod)) {
    set(periodsHistoryAtom, [...get(periodsHistoryAtom), prevPeriod]);
  }
  set(periodsAtom, value);
});

export const handlePreviousPeriodAtom = atom(null, (get, set) => {
  let history = get(periodsHistoryAtom);
  let prevPeriod = history.length > 0 ? history[history.length - 1] : null;

  set(periodsAtom, prevPeriod);

  if (prevPeriod) {
    history.splice(-1);
    set(periodsHistoryAtom, history);
  }
});
