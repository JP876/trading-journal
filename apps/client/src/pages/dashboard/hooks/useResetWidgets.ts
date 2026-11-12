import { useSetAtom } from "jotai";
import { useCallback } from "react";

import { resetStoreAtom, tradeDurationsChartStore } from "../widgets/TradeDurations/atoms";

const useResetWidgets = () => {
  const resetTradeDurations = useSetAtom(resetStoreAtom, { store: tradeDurationsChartStore });

  const reset = useCallback(() => {
    resetTradeDurations();
  }, []);

  return [reset];
};

export default useResetWidgets;
