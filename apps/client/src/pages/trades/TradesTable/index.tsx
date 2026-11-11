import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

import { getTrades } from "../../../api/trades";
import { tableFiltersAtom, tablePaginationAtom } from "../../../components/table/atoms";
import TableMain from "../../../components/table/TableMain";
import { QueryKey } from "../../../enums";
import { visibilityAtom } from "../atoms";
import { tradesTableStore } from "../atoms/store";
import useColumns from "./hooks/useColumns";

const jAtoms = {
  visibility: visibilityAtom,
};

const TradesTableMain = () => {
  const columns = useColumns();

  const { pageIndex, pageSize } = useAtomValue(tablePaginationAtom, { store: tradesTableStore });
  const filters = useAtomValue(tableFiltersAtom, { store: tradesTableStore });

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKey.TRADES,
      pageIndex + 1,
      pageSize,
      filters.pair,
      filters.result,
      filters.openDate,
      filters.closeDate,
      filters.tags,
    ],
    queryFn: () =>
      getTrades({ page: pageIndex + 1, sortBy: "id", direction: "asc", rowsPerPage: pageSize, ...filters }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "center", my: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <TableMain
      data={data?.results || []}
      columns={columns}
      pageCount={data?.totalPages}
      rowCount={data?.totalItems}
      jAtoms={jAtoms}
    />
  );
};

export default TradesTableMain;
