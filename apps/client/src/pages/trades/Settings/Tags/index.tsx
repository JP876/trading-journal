import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { tablePaginationAtom } from "../../../../components/table/atoms";
import TextFilter from "../../../../components/table/filters/TextFilter";
import TableProvider from "../../../../components/table/TableProvider";
import useModal from "../../../../hooks/useModal";
import { TradesPageModal } from "../../enums";
import TagsTableMain from "./TagsTable";

const TagsMain = () => {
  const { openModal } = useModal();

  return (
    <TableProvider atomValues={[[tablePaginationAtom, { pageIndex: 0, pageSize: 10 }]]}>
      <Stack spacing={2}>
        <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <TextFilter name="title" label="Title" />
          </Box>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => openModal(TradesPageModal.ADD_TAG, { title: "Add tag", size: "xs" })}
            >
              Add tag
            </Button>
          </Stack>
        </Stack>
        <TagsTableMain />
      </Stack>
    </TableProvider>
  );
};

export default TagsMain;
