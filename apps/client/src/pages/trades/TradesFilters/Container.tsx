import Collapse from "@mui/material/Collapse";
import { useAtomValue } from "jotai";

import { tradesFiltersAtom } from "../atoms";
import { COLLAPSE_TIMEOUT } from "../consts";

const TradesFiltersContainer = ({ children }: { children: React.ReactNode }) => {
  const tradesFilters = useAtomValue(tradesFiltersAtom);

  return (
    <Collapse in={tradesFilters} timeout={COLLAPSE_TIMEOUT}>
      {children}
    </Collapse>
  );
};

export default TradesFiltersContainer;
