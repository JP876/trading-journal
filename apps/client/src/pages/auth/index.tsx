import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAtomValue } from "jotai";
import { lazy, Suspense, ViewTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

import useSnackbar from "../../hooks/useSnackbar";
import { authFormAtom } from "./atoms";
import LoginFormFallback from "./fallbacks/LoginFormFallback";
import RegisterFormFallback from "./fallbacks/RegisterFormFallback";
import LoginForm from "./forms/Login";
import GuestLogin from "./GuestLogin";
import useToggleAuthForm from "./hooks/useToggleAuthForm";

const RegisterForm = lazy(() => import("./forms/Register"));

const AuthTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  lineHeight: 1.6,
  letterSpacing: 2,
  textWrap: "pretty",
  "& span": {
    display: "flex",
    alignItems: "center",
    gap: 1,
    svg: { height: "2rem", width: "2rem" },
  },
}));

const LoginFormContainer = () => {
  const [toggle] = useToggleAuthForm();
  const { openSnackbar } = useSnackbar();

  return (
    <ErrorBoundary
      fallbackRender={LoginFormFallback}
      onError={() => {
        openSnackbar({
          severity: "error",
          message: "Something went wrong while loading the login form. Please try again shortly.",
        });
      }}
    >
      <Divider sx={{ span: { fontSize: "0.875rem" } }} textAlign="center">
        Or continue with
      </Divider>
      <LoginForm />
      <Stack
        direction="row"
        spacing={1}
        sx={[
          (theme) => ({
            justifyContent: "center",
            alignItems: "center",
            marginBlockStart: theme.spacing(-2),
          }),
        ]}
      >
        <Typography sx={{ fontWeight: "medium" }} variant="body2">
          Don&apos;t have an account?
        </Typography>
        <Button size="small" disableRipple variant="text" onClick={toggle}>
          Sign Up
        </Button>
      </Stack>
    </ErrorBoundary>
  );
};

const RegisterFormContainer = () => {
  const [toggle] = useToggleAuthForm();
  const { openSnackbar } = useSnackbar();

  return (
    <ErrorBoundary
      fallbackRender={RegisterFormFallback}
      onError={() => {
        openSnackbar({
          severity: "error",
          message: "Something went wrong while loading the register form. Please try again shortly.",
        });
      }}
    >
      <Divider sx={{ span: { fontSize: "0.875rem" } }} textAlign="center">
        Or with username, email and password
      </Divider>
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm />
      </Suspense>
      <Stack
        direction="row"
        spacing={1}
        sx={[
          (theme) => ({
            justifyContent: "center",
            alignItems: "center",
            marginBlockStart: theme.spacing(-2),
          }),
        ]}
      >
        <Typography sx={{ fontWeight: "medium" }} variant="body2">
          Have an account?
        </Typography>
        <Button disableRipple size="small" onClick={toggle}>
          Log in
        </Button>
      </Stack>
    </ErrorBoundary>
  );
};

const AuthForm = () => {
  const show = useAtomValue(authFormAtom);
  return <ViewTransition>{show === "login" ? <LoginFormContainer /> : <RegisterFormContainer />}</ViewTransition>;
};

const AuthPage = () => {
  return (
    <Stack sx={[{ height: "100vh", justifyContent: "center", alignItems: "center" }]} direction="row">
      <Paper sx={{ width: "clamp(24rem, 40vw, 30rem)", p: 4, gap: 4, display: "flex", flexDirection: "column" }}>
        <Stack sx={[{ alignItems: "center", flexDirection: "row", justifyContent: "center" }]}>
          <AuthTitle variant="h4">
            Welcome to
            <span>
              <CandlestickChartIcon /> LogMyTrades
            </span>
          </AuthTitle>
        </Stack>
        <Box sx={() => ({ display: "grid", gridTemplateColumns: "1fr", gap: 2 })}>
          <GuestLogin />
          {/* <GoogleButton /> */}
        </Box>
        <AuthForm />
      </Paper>
    </Stack>
  );
};

export default AuthPage;
