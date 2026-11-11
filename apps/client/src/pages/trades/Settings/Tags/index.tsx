import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { lazy, Suspense } from "react";

import DialogMain from "../../../../components/DialogMain";
import TextFilter from "../../../../components/table/filters/TextFilter";
import TableProvider from "../../../../components/table/TableProvider";
import useModal from "../../../../hooks/useModal";
import { TradesPageModal } from "../../enums";
import TagsTableMain from "./TagsTable";

const EditTagForm = lazy(() => import("./forms/EditForm"));
const DeleteTag = lazy(() => import("./DeleteTag"));

const TagModalList = () => {
  return (
    <Suspense>
      <DialogMain id={TradesPageModal.EDIT_TAG} title="Edit tag">
        <EditTagForm />
      </DialogMain>

      <DialogMain
        id={TradesPageModal.DELETE_TAG}
        title="Are you absolutely sure?"
        hideCloseBtn
        dialogContentProps={{ dividers: false }}
      >
        <DeleteTag />
      </DialogMain>
    </Suspense>
  );
};

const TagsMain = () => {
  const { openModal } = useModal();

  return (
    <TableProvider pageSize={10}>
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
              onClick={() => openModal(TradesPageModal.ADD_TAG)}
            >
              Add tag
            </Button>
          </Stack>
        </Stack>
        <TagsTableMain />
      </Stack>

      <TagModalList />
    </TableProvider>
  );
};

export default TagsMain;
