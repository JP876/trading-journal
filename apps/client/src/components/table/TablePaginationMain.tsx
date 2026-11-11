import type { ReactTable, RowData } from "@tanstack/react-table";

import Pagination from "@mui/material/Pagination";
import { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { TSelectInputOption } from "../inputs/SelectInput";
import type { tableMainFeatures } from "./consts";

import SelectInput from "../inputs/SelectInput";
import Results from "./Results";

type TTablePaginationMainProps<TData extends RowData> = {
  table: ReactTable<typeof tableMainFeatures, TData, null>;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions?: TSelectInputOption[];
  hidePageSizeSelect?: boolean;
};

const DEFAULT_SIZE_OPTIONS = [10, 20, 50, 100].map((value) => ({ value, label: value.toString() }));

type TRowsPerPageSelectProps = {
  value: number;
  onChange: (event: SelectChangeEvent<number>) => void;
  pageSizeOptions?: TSelectInputOption[];
};

function RowsPerPageSelect({ value, onChange, pageSizeOptions = DEFAULT_SIZE_OPTIONS }: TRowsPerPageSelectProps) {
  return (
    <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Typography>Rows per page</Typography>
      <SelectInput
        value={value}
        onChange={onChange}
        options={pageSizeOptions}
        formControlProps={{ sx: { width: "3.2rem" } }}
        variant="standard"
      />
    </Stack>
  );
}

function TablePaginationMain<TData extends RowData>({
  table,
  pageIndex,
  pageSize,
  pageSizeOptions = DEFAULT_SIZE_OPTIONS,
  hidePageSizeSelect,
}: TTablePaginationMainProps<TData>) {
  const handlePagination = (_: React.ChangeEvent<unknown>, page: number) => {
    table.setPageIndex(page - 1);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 500);
  };

  const handlePageSize = (event: SelectChangeEvent<number>) => {
    table.setPageSize(event.target.value);
  };

  return (
    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 2, mt: 2 }}>
      <Results totalItems={table.getRowCount()} currentPage={pageIndex + 1} itemsPerPage={pageSize} />
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        {hidePageSizeSelect ? null : (
          <RowsPerPageSelect value={pageSize} onChange={handlePageSize} pageSizeOptions={pageSizeOptions} />
        )}
        <Pagination
          showFirstButton
          showLastButton
          variant="outlined"
          shape="rounded"
          count={table.getPageCount()}
          page={pageIndex + 1}
          onChange={handlePagination}
          disabled={table.getPageCount() <= 1}
        />
      </Stack>
    </Stack>
  );
}

export default TablePaginationMain;
