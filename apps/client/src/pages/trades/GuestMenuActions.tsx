import AddIcon from "@mui/icons-material/Add";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import PublishIcon from "@mui/icons-material/Publish";
import QueueIcon from "@mui/icons-material/Queue";

import MenuActions from "../../components/MenuActions";
import useModal from "../../hooks/useModal";
import { TradesPageModal } from "./enums";
import ExportTradesItem from "./ExportTradesItem";

const GuestMenuActions = () => {
  const { openModal } = useModal();

  const handleClick = (handleClose: () => void, fn: () => void) => {
    handleClose();
    fn();
  };

  return (
    <MenuActions btnProps={{ children: <ControlPointIcon /> }}>
      {/* Implemented only when user is logged in as guest */}
      <MenuActions.Item
        icon={<AddIcon />}
        label="Add trade"
        onClick={(_, handleClose) =>
          handleClick(handleClose, () => openModal(TradesPageModal.ADD_TRADE, { title: "Add trade" }))
        }
      />
      <MenuActions.Divider />
      <MenuActions.Item
        icon={<PublishIcon />}
        label="Import trades"
        onClick={(_, handleClose) =>
          handleClick(handleClose, () =>
            openModal(TradesPageModal.IMPORT_TRADES, { title: "Import trades", size: "md" }),
          )
        }
      />
      <ExportTradesItem />
      <MenuActions.Divider />
      <MenuActions.Item
        icon={<QueueIcon />}
        label="Add sample trades"
        onClick={(_, handleClose) =>
          handleClick(handleClose, () => openModal(TradesPageModal.ADD_RANDOM_TRADES, { title: "Add sample trades" }))
        }
      />
    </MenuActions>
  );
};

export default GuestMenuActions;
