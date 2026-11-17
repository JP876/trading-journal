import FileDownloadIcon from "@mui/icons-material/FileDownload";

import MenuActions from "../../components/MenuActions";
import useExportTrades from "./hooks/useExportTrades";

const ExportTradesItem = () => {
  const [handleExport] = useExportTrades();

  const handleClick = (_: any, handleClose: () => void) => {
    handleClose();
    handleExport();
  };

  return <MenuActions.Item icon={<FileDownloadIcon />} label="Export trades" onClick={handleClick} />;
};

export default ExportTradesItem;
