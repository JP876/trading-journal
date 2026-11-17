import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";

import { getTrades } from "../../../api/trades";
import AutocompleteFilter from "../../../components/table/filters/AutocompleteFilter";
import DateFilter from "../../../components/table/filters/DateFilter";
import { QueryKey } from "../../../enums";
import { resultOptions } from "../consts";
import usePairsOptions from "../hooks/usePairsOptions";
import useTagsOptions from "../hooks/useTagsOptions";

const TradesFilters = () => {
  const pairsOptions = usePairsOptions();
  const tagsOptions = useTagsOptions();

  const tradesQuery = useQuery({
    queryKey: [QueryKey.TRADES],
    queryFn: () => getTrades({}),
  });

  const uniquePairs = [...new Set((tradesQuery.data?.results || []).map((el) => el.pair))];

  return (
    <Box
      sx={{
        mb: 2,
        width: "100%",
        gap: 2,
        display: "grid",
        gridTemplateColumns: { xl: "repeat(6, 1fr)", lg: "12rem 12rem repeat(3, 1fr)", md: "repeat(3, 1fr)" },
      }}
    >
      <AutocompleteFilter
        name="pair"
        label="Pair"
        options={pairsOptions}
        getOptionDisabled={(option) => {
          return !uniquePairs.includes(+option.value);
        }}
      />
      <AutocompleteFilter name="result" label="Result" options={resultOptions} />
      <DateFilter name="openDate" label="Open" disableFuture />
      <DateFilter name="closeDate" label="Close" disableFuture />
      <AutocompleteFilter name="tags" label="Tags" options={tagsOptions} multiple limitTags={1} />
    </Box>
  );
};

export default TradesFilters;
