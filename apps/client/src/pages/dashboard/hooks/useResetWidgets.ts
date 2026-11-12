import { useCallback } from "react";

import { dispatchCustomEvent } from "../../../lib/utils";

export const RESET_WIDGETS_EVENT = "resetWidgetsEvent";

const useResetWidgets = () => {
  const reset = useCallback(() => {
    dispatchCustomEvent(RESET_WIDGETS_EVENT);
  }, []);

  return [reset];
};

export default useResetWidgets;
