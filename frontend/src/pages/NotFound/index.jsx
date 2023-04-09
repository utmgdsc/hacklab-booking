import { React } from "react";
import { Link } from "../../components";
import { Typography, Container } from "@mui/material";
import SadMascot from "../../assets/img/sad-mascot.png";

export const NotFound = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "nowrap",
        marginTop: "2em",
        gap: "1em",
      }}
    >
        <img width="200" src={SadMascot} alt={"Sparkle Mascot"} />
      <Typography variant="h3">Page not found</Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
      <Typography variant="body1">
        Go back to the{" "}
        <Link isInternalLink href="/" underline="hover">
          Dashboard
        </Link>
      </Typography>
    </Container>
  );
};
