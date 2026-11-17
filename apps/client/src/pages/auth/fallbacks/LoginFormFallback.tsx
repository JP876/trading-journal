import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const LoginFormFallback = () => {
  return (
    <Stack sx={{ gap: 4, position: "relative" }}>
      <Skeleton variant="rectangular" width="100%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={32} />
    </Stack>
  );
};

export default LoginFormFallback;
