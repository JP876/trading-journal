import ErrorIcon from "@mui/icons-material/Error";
import { Tooltip } from "@mui/material";
import Paper, { type PaperProps } from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { atom, useSetAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";

import ClampedTextContainer from "../../../components/ClampedTextContainer";
import useUnmount from "../../../hooks/useUnmount";

export const widgetContainerErrorAtom = atom<TWidgetContainerError>({ children: false, actions: false });

const WidgetContainerPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",

  "& > div:last-child": {
    padding: theme.spacing(2),
  },
}));

const WidgetContainerHeader = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  position: "sticky",
  top: 0,
  left: 0,
  zIndex: theme.zIndex.appBar,
  gap: theme.spacing(2),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

export type TWidgetContainerProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  renderActions?: () => React.ReactNode;
  paperProps?: PaperProps;
};

type TWidgetContainerFallackProps = {
  title?: string;
};

const WidgetContainerFallback = ({ title }: TWidgetContainerFallackProps) => {
  const setError = useSetAtom(widgetContainerErrorAtom);

  useUnmount(() => {
    setError((prev) => ({ ...prev, children: false }));
  });

  return (
    <Stack sx={[() => ({ alignItems: "center", justifyContent: "center", height: "100%", width: "100%" })]}>
      <Stack sx={{ width: "min(24rem, 90%)", alignItems: "center", gap: 1 }}>
        <ErrorIcon color="error" />
        <Typography variant="body1" sx={{ textAlign: "center", textWrap: "balance" }}>
          Something went wrong. {title ? `Widget: ${title}` : "This widget"} is temporarily unavailable.
        </Typography>
      </Stack>
    </Stack>
  );
};

const WidgetActionsFallback = () => {
  const setError = useSetAtom(widgetContainerErrorAtom);

  useUnmount(() => {
    setError((prev) => ({ ...prev, actions: false }));
  });

  return (
    <Tooltip arrow disableInteractive title="This widget's actions are temporarily unavailable.">
      <ErrorIcon color="error" />
    </Tooltip>
  );
};

type TWidgetContainerError = {
  children: boolean;
  actions: boolean;
};

const WidgetContainer = ({ title, description, renderActions, paperProps, children }: TWidgetContainerProps) => {
  const setError = useSetAtom(widgetContainerErrorAtom);

  return (
    <WidgetContainerPaper {...paperProps}>
      <ErrorBoundary fallbackRender={() => <WidgetContainerFallback title={title} />}>
        <WidgetContainerHeader>
          <Stack>
            <Typography variant="h5">{title}</Typography>
            <ClampedTextContainer variant="caption" maxRows={1}>
              {description}
            </ClampedTextContainer>
          </Stack>
          <ErrorBoundary
            FallbackComponent={WidgetActionsFallback}
            onError={() => setError((prev) => ({ ...prev, actions: true }))}
          >
            {renderActions ? renderActions() : null}
          </ErrorBoundary>
        </WidgetContainerHeader>

        <ErrorBoundary
          fallbackRender={() => <WidgetContainerFallback />}
          onError={() => setError((prev) => ({ ...prev, children: true }))}
        >
          {children}
        </ErrorBoundary>
      </ErrorBoundary>
    </WidgetContainerPaper>
  );
};

export default WidgetContainer;
