import { useContext } from "react";

import { JStoreContext } from "../../../components/JotaiProvider";

const useDashboardStore = () => {
  const context = useContext(JStoreContext);
  if (!context) {
    throw new Error("useDashboardStore must be used within a JStoreProvider");
  }
  return context;
};

export default useDashboardStore;
