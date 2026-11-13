import Backdrop, { type BackdropProps } from "@mui/material/Backdrop";
import CircularProgress, { type CircularProgressProps } from "@mui/material/CircularProgress";

type TBackdropProgress = {
  circularProgressProps?: CircularProgressProps;
} & BackdropProps;

const BackdropProgress = ({ circularProgressProps, ...rest }: TBackdropProgress) => {
  return (
    <Backdrop sx={[(theme) => ({ color: theme.palette.grey[100], zIndex: theme.zIndex.drawer + 1 })]} {...rest}>
      <CircularProgress color="inherit" size={72} />
    </Backdrop>
  );
};

export default BackdropProgress;
