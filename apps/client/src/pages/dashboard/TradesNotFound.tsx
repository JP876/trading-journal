import InfoIcon from "@mui/icons-material/Info";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

import { FallbackMessageContainer } from "../../components/styledComps";

const TradesNotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/trades", { viewTransition: true });
  };

  return (
    <FallbackMessageContainer>
      <InfoIcon color="info" />
      <Typography variant="body1">
        You haven't added any trades yet, so your dashboard is empty. Add trades whenever you're ready.
      </Typography>
      <Stack sx={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
        <Button size="small" variant="outlined" onClick={handleClick}>
          Go to Trades page
        </Button>
      </Stack>
    </FallbackMessageContainer>
  );
};

export default TradesNotFound;
