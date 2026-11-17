import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useAtom } from "jotai";

import useClearFilters from "../../../components/table/hooks/useClearFilters";
import { tradesFiltersAtom } from "../atoms";
import { COLLAPSE_TIMEOUT } from "../consts";

const TradesFiltersButton = () => {
  const [tradesFilters, setTradesFilters] = useAtom(tradesFiltersAtom);
  const [clearFilters] = useClearFilters({ wait: COLLAPSE_TIMEOUT + 20 });

  const handleClick = () => {
    setTradesFilters((prevValue) => !prevValue);
    clearFilters();
  };

  return (
    <Box
      sx={(theme) => ({
        width: "34px",
        height: "34px",
        position: "relative",

        "& svg": {
          position: "absolute",
          transition: theme.transitions.create(["opacity"]),
        },
        "#open": { opacity: +!tradesFilters },
        "#close": { opacity: +!!tradesFilters },
      })}
    >
      <IconButton
        size="small"
        aria-label={`${tradesFilters ? "close" : "open"}-filters-button`}
        onClick={handleClick}
        sx={{
          width: "inherit",
          height: "inherit",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <FilterListIcon id="open" />
        <FilterListOffIcon id="close" />
      </IconButton>
    </Box>
  );
};

export default TradesFiltersButton;
