import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAtomValue } from "jotai";
import { lazy, Suspense } from "react";

import type { TSelectInputOption } from "../../components/inputs/SelectInput";

import { userAtom } from "../../atoms";
import JotaiProvider from "../../components/JotaiProvider";
import { tableFiltersAtom } from "../../components/table/atoms";
import ColumnVisibilitySelect from "../../components/table/ColumnVisibilitySelect";
import useModal from "../../hooks/useModal";
import { visibilityAtom } from "./atoms";
import { TradesPageModal } from "./enums";
import GuestMenuActions from "./GuestMenuActions";
import TradesFilters from "./TradesFilters";
import TradesFiltersButton from "./TradesFilters/Button";
import TradesFiltersContainer from "./TradesFilters/Container";
import TradingSessionSelect from "./TradingSessionSelect";

const TradesTableMain = lazy(() => import("./TradesTable"));

const AddTradeButton = () => {
  const { openModal } = useModal();

  return (
    <IconButton
      size="small"
      aria-label="add-trade-button"
      onClick={() => openModal(TradesPageModal.ADD_TRADE, { title: "Add trade" })}
    >
      <AddIcon />
    </IconButton>
  );
};

const SettingsButton = () => {
  const { openModal } = useModal();

  return (
    <IconButton
      size="small"
      aria-label="trades-settings-button"
      onClick={() => openModal(TradesPageModal.SETTINGS, { title: "Settings", size: "md" })}
    >
      <SettingsIcon />
    </IconButton>
  );
};

const visibilityOptions: TSelectInputOption[] = [
  { value: "pair", label: "Pair" },
  { value: "direction", label: "Direction" },
  { value: "result", label: "Result" },
  { value: "takeProfit", label: "Take profit" },
  { value: "stopLoss", label: "Stop loss" },
  { value: "tags", label: "Tags" },
  { value: "openDate", label: "Open date" },
  { value: "closeDate", label: "Close date" },
  { value: "comment", label: "Comment" },
];

const initialFilters = { pair: null, result: null, openDate: null, closeDate: null, tags: null };

const TradesPage = () => {
  const user = useAtomValue(userAtom);

  return (
    <JotaiProvider atomValues={[[tableFiltersAtom, initialFilters]]}>
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          rowGap: 2,
        }}
      >
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Typography variant="h4">Trades</Typography>

          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
            {user?.variety === "GUEST" ? <GuestMenuActions /> : <AddTradeButton />}
            <TradesFiltersButton />
          </Stack>
        </Stack>

        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <ColumnVisibilitySelect options={visibilityOptions} anAtom={visibilityAtom} width="15rem" />
          <TradingSessionSelect />
          <SettingsButton />
        </Stack>
      </Stack>

      <TradesFiltersContainer>
        <TradesFilters />
      </TradesFiltersContainer>
      <Paper sx={{ p: 2 }}>
        <Suspense fallback={<Skeleton variant="rounded" width="100%" height="100%" />}>
          <TradesTableMain />
        </Suspense>
      </Paper>
    </JotaiProvider>
  );
};

export default TradesPage;
