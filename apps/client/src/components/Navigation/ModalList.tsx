import { getDefaultStore, useAtomValue } from "jotai";
import { lazy, memo, Suspense, useCallback, useEffect, ViewTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { modalAtom } from "../../atoms";
import useSnackbar from "../../hooks/useSnackbar";
import { TradesPageModal } from "../../pages/trades/enums";
import DialogMain from "../DialogMain";
import BackdropProgress from "../feedback/BackdropProgress";

const IntroForm = lazy(() => import("./Intro"));

const AddTradeForm = lazy(() => import("../../pages/trades/forms/AddTrade"));
const AddRandomTradesForm = lazy(() => import("../../pages/trades/forms/AddRandomTrades"));
const EditTradeForm = lazy(() => import("../../pages/trades/forms/EditTrade"));
const DeleteTrade = lazy(() => import("../../pages/trades/DeleteTrade"));
const ImportTrades = lazy(() => import("../../pages/trades/ImportTrades"));

const TradesSettingsMain = lazy(() => import("../../pages/trades/Settings"));

const AddTagForm = lazy(() => import("../../pages/trades/Settings/Tags/forms/AddForm"));
const EditTagForm = lazy(() => import("../../pages/trades/Settings/Tags/forms/EditForm"));
const DeleteTag = lazy(() => import("../../pages/trades/Settings/Tags/DeleteTag"));

const AddTradingSessionForm = lazy(() => import("../../pages/trades/Settings/TradingSessions/forms/AddForm"));
const EditTradingSessionForm = lazy(() => import("../../pages/trades/Settings/TradingSessions/forms/EditForm"));
const DeleteTradingSession = lazy(() => import("../../pages/trades/Settings/TradingSessions/DeleteTradingSession"));

type TDialogComponent =
  | (() => React.ReactElement)
  | React.MemoExoticComponent<() => React.ReactElement>
  | React.LazyExoticComponent<() => React.ReactElement>;

const dialogComponentsMap = new Map<string, TDialogComponent>([
  [TradesPageModal.INTRO, IntroForm],
  //
  [TradesPageModal.ADD_TRADE, AddTradeForm],
  [TradesPageModal.ADD_RANDOM_TRADES, AddRandomTradesForm],
  [TradesPageModal.EDIT_TRADE, EditTradeForm],
  [TradesPageModal.DELETE_TRADE, DeleteTrade],
  [TradesPageModal.IMPORT_TRADES, ImportTrades],
  //
  [TradesPageModal.SETTINGS, TradesSettingsMain],
  //
  [TradesPageModal.ADD_TAG, AddTagForm],
  [TradesPageModal.EDIT_TAG, EditTagForm],
  [TradesPageModal.DELETE_TAG, DeleteTag],
  //
  [TradesPageModal.ADD_TRADING_SESSION, AddTradingSessionForm],
  [TradesPageModal.EDIT_TRADING_SESSION, EditTradingSessionForm],
  [TradesPageModal.DELETE_TRADING_SESSION, DeleteTradingSession],
]);

const NoTransition = ({ children }: { children: React.ReactElement }) => children;

const ModalErrorFallback = ({ message }: { message?: string }) => {
  const { openSnackbar } = useSnackbar();

  useEffect(() => {
    openSnackbar({
      severity: "error",
      message: message || "We couldn't display this dialog right now.",
    });
  }, []);

  return null;
};

const ModalSuspenseFallback = () => (
  <ViewTransition>
    <BackdropProgress open />
  </ViewTransition>
);

const ModalList = () => {
  const modalInfo = useAtomValue(modalAtom, { store: getDefaultStore() });

  const renderContent = useCallback((id: string) => {
    const Component = dialogComponentsMap.get(id);
    if (!Component) {
      throw new Error(`Dialog/modal component not found for ID: ${id}`);
    }
    return <Component />;
  }, []);

  return (Object.keys(modalInfo) || []).map((id) => {
    if (!dialogComponentsMap.has(id)) return null;
    const info = modalInfo[id];

    return (
      <ErrorBoundary key={id} fallbackRender={() => <ModalErrorFallback message={info.errorMessage} />}>
        <Suspense fallback={<ModalSuspenseFallback />}>
          <ViewTransition>
            <DialogMain
              {...info}
              title={info?.title || ""}
              dialogProps={{
                slots: { transition: NoTransition, ...(info?.dialogProps?.slots || {}) },
                ...(info?.dialogProps || {}),
              }}
              id={id}
            >
              {renderContent(id)}
            </DialogMain>
          </ViewTransition>
        </Suspense>
      </ErrorBoundary>
    );
  });
};

export default memo(ModalList);
